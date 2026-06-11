CREATE TABLE M_TrainType
(
    train_type_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL
);

INSERT INTO M_TrainType (train_type_cd, name)
VALUES ('YM001', 'やまびこ11号'),
       ('YM002', 'やまびこ12号'),
       ('YM003', 'やまびこ13号'),
       ('YM004', 'やまびこ14号'),
       ('YM005', 'やまびこ15号'),
       ('YM006', 'やまびこ16号'),
       ('YM007', 'やまびこ17号'),
       ('YM008', 'やまびこ18号'),
       ('YM009', 'やまびこ19号');
