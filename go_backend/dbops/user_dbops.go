package dbops

import (
	"context"

	"syncflow/entities"
	"gorm.io/gorm"
)

type UserDBOps interface {
	Create(ctx context.Context, user *entities.User) error
	GetByID(ctx context.Context, id uint) (*entities.User, error)
	GetByEmail(ctx context.Context, email string) (*entities.User, error)
}

type userDBOps struct {
	db *gorm.DB
}

func NewUserDBOps(db *gorm.DB) UserDBOps {
	return &userDBOps{db: db}
}

func (d *userDBOps) Create(ctx context.Context, user *entities.User) error {
	return d.db.WithContext(ctx).Create(user).Error
}

func (d *userDBOps) GetByID(ctx context.Context, id uint) (*entities.User, error) {
	var user entities.User
	err := d.db.WithContext(ctx).First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (d *userDBOps) GetByEmail(ctx context.Context, email string) (*entities.User, error) {
	var user entities.User
	err := d.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
