CREATE TABLE M_TrainCarType
(
    train_car_type_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL UNIQUE
);
