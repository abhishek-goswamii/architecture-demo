package services

import (
	"context"
	"testing"

	"syncflow/entities"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockUserDBOps is a mock of UserDBOps
type MockUserDBOps struct {
	mock.Mock
}

func (m *MockUserDBOps) Create(ctx context.Context, user *entities.User) error {
	args := m.Called(ctx, user)
	return args.Error(0)
}

func (m *MockUserDBOps) GetByID(ctx context.Context, id uint) (*entities.User, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.User), args.Error(1)
}

func (m *MockUserDBOps) GetByEmail(ctx context.Context, email string) (*entities.User, error) {
	args := m.Called(ctx, email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.User), args.Error(1)
}

func TestCreateUser(t *testing.T) {
	mockDBOps := new(MockUserDBOps)
	service := NewUserService(mockDBOps)
	ctx := context.Background()

	t.Run("Success", func(t *testing.T) {
		req := CreateUserRequest{
			Name:  "John Doe",
			Email: "john@example.com",
		}

		mockDBOps.On("GetByEmail", ctx, req.Email).Return(nil, nil).Once()
		mockDBOps.On("Create", ctx, mock.AnythingOfType("*entities.User")).Return(nil).Once()

		user, err := service.CreateUser(ctx, req)

		assert.NoError(t, err)
		assert.NotNil(t, user)
		assert.Equal(t, req.Name, user.Name)
		assert.Equal(t, req.Email, user.Email)
		mockDBOps.AssertExpectations(t)
	})

	t.Run("UserAlreadyExists", func(t *testing.T) {
		req := CreateUserRequest{
			Name:  "John Doe",
			Email: "john@example.com",
		}
		existingUser := &entities.User{Email: req.Email}

		mockDBOps.On("GetByEmail", ctx, req.Email).Return(existingUser, nil).Once()

		user, err := service.CreateUser(ctx, req)

		assert.Error(t, err)
		assert.Nil(t, user)
		assert.Contains(t, err.Error(), "already exists")
		mockDBOps.AssertExpectations(t)
	})
}
