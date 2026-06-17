CREATE TABLE M_SeatType
(
    seat_type_cd VARCHAR(6)   NOT NULL PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    train_car_type_cd  VARCHAR(5)   NOT NULL REFERENCES M_TrainCarType (train_car_type_cd) ON DELETE RESTRICT
);

INSERT INTO M_SeatType (seat_type_cd, name, train_car_type_cd)
VALUES ('SEAT01', '指定席構成', 'CAR01'),
       ('SEAT02', 'グリーン車構成', 'CAR02'),
       ('SEAT03', 'グランクラス構成', 'CAR03');
