CREATE TABLE M_Seat
(
    seat_cd      VARCHAR(9) NOT NULL PRIMARY KEY,
    seat_type_cd VARCHAR(6) NOT NULL,
    seat_number  INT        NOT NULL,
    seat_column  VARCHAR(1) NOT NULL,
    UNIQUE (seat_type_cd, seat_number, seat_column)
);

INSERT INTO M_Seat (seat_cd, seat_type_cd, seat_number, seat_column)
VALUES ('SEAT01001', 'SEAT01', 1, 'A'),
       ('SEAT01002', 'SEAT01', 1, 'B'),
       ('SEAT01003', 'SEAT01', 1, 'C'),
       ('SEAT02001', 'SEAT02', 2, 'A'),
       ('SEAT02002', 'SEAT02', 2, 'B'),
       ('SEAT02003', 'SEAT02', 2, 'C'),
       ('SEAT03001', 'SEAT03', 3, 'A'),
       ('SEAT03002', 'SEAT03', 3, 'B'),
       ('SEAT03003', 'SEAT03', 3, 'C');
