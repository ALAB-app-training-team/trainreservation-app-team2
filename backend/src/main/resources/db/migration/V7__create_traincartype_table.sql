CREATE TABLE M_TrainCarType
(
    train_car_type_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO M_TrainCarType (train_car_type_cd, name)
VALUES ('CAR01', '指定席'),
       ('CAR02', 'グリーン車'),
       ('CAR03', 'グランクラス');
