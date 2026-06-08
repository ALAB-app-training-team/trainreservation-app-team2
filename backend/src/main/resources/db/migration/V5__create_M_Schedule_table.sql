CREATE TABLE M_Schedule
(
    schedule_cd   VARCHAR(6) NOT NULL PRIMARY KEY,
    train_type_cd VARCHAR(5) NOT NULL REFERENCES M_TrainType (train_type_cd) ON DELETE RESTRICT
);
