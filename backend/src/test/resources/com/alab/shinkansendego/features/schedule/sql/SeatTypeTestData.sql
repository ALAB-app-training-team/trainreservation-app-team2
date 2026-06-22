CREATE TABLE M_SeatType
(
    seat_type_cd      VARCHAR(6)   NOT NULL PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    train_car_type_cd VARCHAR(5)   NOT NULL
);

INSERT INTO M_SeatType (seat_type_cd, name, train_car_type_cd)
VALUES ('SEAT01', 'Test1構成', 'CAR01'),
       ('SEAT02', 'Test2構成', 'CAR02'),
       ('SEAT03', 'Test3構成', 'CAR03');
