package mockdb

import (
	"time"

	"github.com/dmartzol/hackerspace/internal/models"
)

// MockDB represents a database
type MockDB struct{}

func NewMockDB() (*MockDB, error) {
	return &MockDB{}, nil
}

func (db *MockDB) AccountExists(email string) (bool, error) {
	if email == "registered@email.com" {
		return true, nil
	}
	return false, nil
}

func (db *MockDB) Account(id int64) (*models.Account, error) {
	var a models.Account
	return &a, nil
}

func (db *MockDB) Accounts() (models.Accounts, error) {
	var accs []*models.Account
	return accs, nil
}

func (db *MockDB) AccountWithCredentials(email, allegedPassword string) (*models.Account, error) {
	var a models.Account
	return &a, nil
}

func (db *MockDB) CreateAccount(first, last, email, password string, dob time.Time, gender, phone *string) (*models.Account, *models.ConfirmationCode, error) {
	a := models.Account{
		Row: models.Row{
			ID:         1,
			CreateTime: time.Now(),
			UpdateTime: time.Now(),
		},
		FirstName: first,
		LastName:  last,
		Email:     email,
		DOB:       dob,
		Gender:    gender,
	}
	var cc models.ConfirmationCode
	return &a, &cc, nil
}

func (db *MockDB) SessionFromIdentifier(identifier string) (*models.Session, error) {
	var s models.Session
	return &s, nil
}

func (db *MockDB) CreateSession(accountID int64) (*models.Session, error) {
	var s models.Session
	return &s, nil
}

func (db *MockDB) DeleteSession(identifier string) error {
	return nil
}

func (db *MockDB) CleanSessionsOlderThan(age time.Duration) (int64, error) {
	return 2, nil
}

func (db *MockDB) UpdateSession(sessionToken string) (*models.Session, error) {
	var s models.Session
	return &s, nil
}

func (db *MockDB) CreateConfirmationCode(accountID int64, t models.ConfirmationCodeType) (*models.ConfirmationCode, error) {
	var cc models.ConfirmationCode
	return &cc, nil
}
