package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/dmartzol/hackerspace/internal/models"
	"github.com/dmartzol/hackerspace/pkg/httpresponse"
	"github.com/dmartzol/hackerspace/pkg/timeutils"
	"github.com/gorilla/mux"
)

type accountStorage interface {
	Account(id int64) (*models.Account, error)
	Accounts() (models.Accounts, error)
	AccountExists(email string) (bool, error)
	AccountWithCredentials(email, allegedPassword string) (*models.Account, error)
	CreateAccount(first, last, email, password, confirmationCode string, dob time.Time, gender, phone *string) (*models.Account, *models.ConfirmationCode, error)
	CreateConfirmationCode(accountID int64, t models.ConfirmationCodeType) (*models.ConfirmationCode, error)
}

func (api API) GetAccounts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	roleID := ctx.Value(contextRequesterRoleIDKey)
	if roleID == nil {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}
	accs, err := api.Accounts()
	if err != nil {
		log.Printf("accounts: %+v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	httpresponse.RespondJSON(w, accs.Restrict(nil))
}

func (api API) GetAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	// fetching requester id
	requesterID := ctx.Value(contextRequesterAccountIDKey)
	if requesterID == nil {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	// parsing parameters
	params := mux.Vars(r)
	idString, ok := params["id"]
	if !ok {
		http.Error(w, "parameter 'id' not found", http.StatusBadRequest)
		return
	}
	requestedAccountID, err := strconv.ParseInt(idString, 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("wrong parameter '%s'", idString), http.StatusBadRequest)
		return
	}

	// checking permissions
	if requesterID != requestedAccountID {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}
	a, err := api.Account(requestedAccountID)
	if err != nil {
		log.Printf("Account: %+v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	httpresponse.RespondJSON(w, a.Restrict(nil))
}

func (api API) CreateAccount(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	err := httpresponse.Unmarshal(r, &req)
	if err != nil {
		log.Printf("JSON: %+v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	exists, err := api.AccountExists(req.Email)
	if err != nil {
		log.Printf("%+v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	if exists {
		// see: https://stackoverflow.com/questions/9269040/which-http-response-code-for-this-email-is-already-registered
		err = fmt.Errorf("email '%s' already registered", req.Email)
		log.Printf("%+v", err)
		http.Error(w, fmt.Sprintf("email '%s' alrady exists", req.Email), http.StatusConflict)
		return
	}
	err = req.Validate()
	if err != nil {
		log.Printf("%+v", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	parsedDOB, err := time.Parse(timeutils.LayoutISO, req.DOB)
	if err != nil {
		log.Printf("%s: %+v", req.DOB, err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	a, _, err := api.storage.CreateAccount(
		req.FirstName,
		req.LastName,
		req.Email,
		req.Password,
		"111111",
		parsedDOB,
		req.Gender,
		req.PhoneNumber,
	)
	if err != nil {
		log.Printf("%+v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// create session and cookie
	s, err := api.storage.CreateSession(a.ID)
	if err != nil {
		log.Printf("%+v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	cookie := &http.Cookie{
		Name:   hackerSpaceCookieName,
		Value:  s.SessionIdentifier,
		MaxAge: sessionLength,
	}
	http.SetCookie(w, cookie)

	// TODO: send confirmation code by email

	httpresponse.RespondJSON(w, a.Restrict(nil))
}

func (api API) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req models.ResetPasswordRequest
	err := httpresponse.Unmarshal(r, &req)
	if err != nil {
		log.Printf("JSON: %+v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	// TODO: create confirmation code in db
	// TODO: send email with link to reset password
	httpresponse.RespondText(w, "If the account exists, an email will be sent with recovery details.", http.StatusAccepted)
}

func (api API) ConfirmEmail(w http.ResponseWriter, r *http.Request) {
	var req models.ConfirmEmailRequest
	err := httpresponse.Unmarshal(r, &req)
	if err != nil {
		log.Printf("JSON: %+v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// TODO: fetch query parameter with confirmation code
	// TODO: check if code matches in db

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Email has been confirmed.")
}
