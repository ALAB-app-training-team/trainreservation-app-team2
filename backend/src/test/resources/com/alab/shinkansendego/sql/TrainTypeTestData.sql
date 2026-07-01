CREATE TABLE M_TrainType
(
    train_type_cd   VARCHAR(5)   NOT NULL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    train_series_cd VARCHAR(5)   NOT NULL
);

INSERT INTO M_TrainType (train_type_cd, name, train_series_cd)
VALUES ('YM001', 'やまびこ11号', 'E5SER'),
       ('YM002', 'やまびこ12号', 'E5SER'),
       ('YM003', 'やまびこ13号', 'E5SER'),
       ('YM004', 'やまびこ14号', 'E5SER'),
       ('YM005', 'やまびこ15号', 'E5SER'),
       ('YM006', 'やまびこ16号', 'E5SER'),
       ('YM007', 'やまびこ17号', 'E5SER'),
       ('YM008', 'やまびこ18号', 'E5SER'),
       ('YM009', 'やまびこ19号', 'E5SER');
