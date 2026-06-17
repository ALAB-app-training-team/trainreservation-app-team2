CREATE TABLE M_TrainSeries
(
    train_series_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL
);

INSERT INTO M_TrainSeries (train_series_cd, name)
VALUES ('E2SER', 'E2系'),
       ('E5SER', 'E5系'),
       ('E6SER', 'E6系'),
       ('E7SER', 'E7系'),
       ('E8SER', 'E8系');
