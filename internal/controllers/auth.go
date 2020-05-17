package controllers

import (
	"context"
	"database/sql"
	"log"
	"net/http"
)

func (api API) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		publicRoutes := map[string]string{
			"/v1/version":  "GET",
			"/v1/sessions": "POST",
			"/v1/accounts": "POST",
		}
		method, in := publicRoutes[r.RequestURI]
		if in && method == r.Method {
			next.ServeHTTP(w, r)
			return
		}
		c, err := r.Cookie(hmmmCookieName)
		if err != nil {
			if err != http.ErrNoCookie {
				log.Printf("cookie: %+v", err)
			}
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
		s, err := api.UpdateSession(c.Value)
		if err != nil {
			if err == sql.ErrNoRows {
				log.Printf("UpdateSession: %+v", err)
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			}
			log.Printf("UpdateSession: %+v", err)
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		a, err := api.Account(s.AccountID)
		if err != nil {
			log.Printf("Account: %+v", err)
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		// Setting up context
		ctx := r.Context()
		ctx = context.WithValue(ctx, contextRequesterAccountIDKey, s.AccountID)
		if a.RoleID != nil {
			ctx = context.WithValue(ctx, contextRequesterRoleIDKey, *a.RoleID)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
