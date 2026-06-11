CREATE TABLE M_Station
(
    station_cd VARCHAR(5)   NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    UNIQUE (name)
);

INSERT INTO M_Station (station_cd, name)
VALUES ('Test0', 'TestStation00'),
       ('Test1', 'TestStation01'),
       ('Test2', 'TestStation02'),
       ('Test3', 'TestStation03'),
       ('Test4', 'TestStation04'),
       ('Test5', 'TestStation05'),
       ('Test6', 'TestStation06'),
       ('Test7', 'TestStation07'),
       ('Test8', 'TestStation08'),
       ('Test9', 'TestStation09');
