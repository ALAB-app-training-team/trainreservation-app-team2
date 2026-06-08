CREATE TABLE M_Schedule
(
    schedule_cd   VARCHAR(6) NOT NULL PRIMARY KEY,
    train_type_cd VARCHAR(5) NOT NULL REFERENCES M_TrainType (train_type_cd)
);
INSERT INTO M_Schedule (schedule_cd, train_type_cd)
VALUES ('TEST01', 'YM001'),
       ('TEST02', 'YM002'),
       ('TEST03', 'YM003'),
       ('TEST04', 'YM004'),
       ('TEST05', 'YM005'),
       ('TEST06', 'YM001'),
       ('TEST07', 'YM006'),
       ('TEST08', 'YM007'),
       ('TEST09', 'YM008'),
       ('TEST10', 'YM009');
