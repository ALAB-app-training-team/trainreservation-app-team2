CREATE TABLE M_TotalSeat
(
    total_seat_cd   VARCHAR(8) NOT NULL PRIMARY KEY,
    train_series_cd VARCHAR(5) NOT NULL REFERENCES M_TrainSeries (train_series_cd) ON DELETE RESTRICT,
    reserved_total  INT        NOT NULL,
    green_total     INT        NOT NULL,
    gc_total        INT        NOT NULL
);

INSERT INTO M_TotalSeat (total_seat_cd, train_series_cd, reserved_total, green_total, gc_total)
VALUES ('TOTAL001', 'E5SER', 800, 60, 18),
       ('TOTAL002', 'E6SER', 600, 60, 0),
       ('TOTAL003', 'E7SER', 1000, 60, 18),
       ('TOTAL004', 'E8SER', 600, 60, 0);
