package dbops

import (
	"context"
	"testing"

	"syncflow/entities"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// NOTE: Testing DBOps ideally requires a real database or a mock.
// In a real production setup, we might use a Dockerized PostgreSQL for integration tests.
// Here we provide a structural example.

func TestUserDBOps_Create(t *testing.T) {
	// This is a placeholder. To run this, you'd need a functional DB connection.
	// In production, you might use a local postgres or a containerized one.
	t.Skip("Skipping integration test: requires database connection")

	dsn := "host=localhost user=postgres password=postgres dbname=syncflow_test port=5432 sslmode=disable"
	db, _ := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	ops := NewUserDBOps(db)
	ctx := context.Background()

	user := &entities.User{
		Name:  "Test User",
		Email: "test@example.com",
	}

	err := ops.Create(ctx, user)
	assert.NoError(t, err)
	assert.NotZero(t, user.ID)
}
