CREATE TABLE M_Seat
(
    seat_cd      VARCHAR(9) NOT NULL PRIMARY KEY,
    seat_type_cd VARCHAR(6) NOT NULL REFERENCES M_SeatType (seat_type_cd) ON DELETE CASCADE,
    seat_number  INT        NOT NULL,
    seat_column  VARCHAR(1) NOT NULL,
    UNIQUE (seat_type_cd,seat_number, seat_column)
);
