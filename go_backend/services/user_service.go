package services

import (
	"context"
	"fmt"

	"syncflow/dbops"
	"syncflow/entities"
)

type CreateUserRequest struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
}

type UserService interface {
	CreateUser(ctx context.Context, req CreateUserRequest) (*entities.User, error)
	GetUser(ctx context.Context, id uint) (*entities.User, error)
}

type userService struct {
	userDBOps dbops.UserDBOps
}

func NewUserService(userDBOps dbops.UserDBOps) UserService {
	return &userService{userDBOps: userDBOps}
}

func (s *userService) CreateUser(ctx context.Context, req CreateUserRequest) (*entities.User, error) {
	// Business logic: check if email already exists
	existingUser, _ := s.userDBOps.GetByEmail(ctx, req.Email)
	if existingUser != nil {
		return nil, fmt.Errorf("user with email %s already exists", req.Email)
	}

	user := &entities.User{
		Name:  req.Name,
		Email: req.Email,
	}

	if err := s.userDBOps.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return user, nil
}

func (s *userService) GetUser(ctx context.Context, id uint) (*entities.User, error) {
	user, err := s.userDBOps.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	return user, nil
}
