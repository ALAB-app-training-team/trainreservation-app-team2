CREATE TABLE M_DepartureArrivalTime
(
    time_cd        VARCHAR(8) NOT NULL PRIMARY KEY,
    schedule_cd    VARCHAR(6) NOT NULL,
    departure_time TIME       NOT NULL,
    arrival_time   TIME       NOT NULL,
    section_cd     VARCHAR(5) NOT NULL
);
INSERT INTO M_DepartureArrivalTime (time_cd, schedule_cd, departure_time, arrival_time, section_cd)
VALUES ('TEST0101', 'TEST01', '06:04', '06:09', 'TEST3'),
       ('TEST0201', 'TEST02', '06:20', '06:25', 'TEST1'),
       ('TEST0301', 'TEST03', '06:32', '06:37', 'TEST1'),
       ('TEST0401', 'TEST04', '06:40', '06:45', 'TEST2'),
       ('TEST0501', 'TEST05', '07:00', '07:05', 'TEST1'),
       ('TEST0601', 'TEST06', '07:12', '07:17', 'TEST1'),
       ('TEST0701', 'TEST07', '07:16', '07:21', 'TEST3'),
       ('TEST0801', 'TEST08', '07:32', '07:37', 'TEST1'),
       ('TEST0901', 'TEST09', '07:40', '07:45', 'TEST1'),
       ('TEST1001', 'TEST10', '07:44', '07:49', 'TEST2'),
       ('TEST1101', 'TEST11', '07:56', '08:01', 'TEST1'),
       ('TEST1201', 'TEST12', '08:07', '08:12', 'TEST1'),
       ('TEST1301', 'TEST13', '08:26', '08:31', 'TEST1'),
       ('TEST1401', 'TEST14', '08:37', '08:42', 'TEST1'),
       ('TEST1501', 'TEST15', '08:37', '08:42', 'TEST3'),
       ('TEST1601', 'TEST16', '08:45', '08:50', 'TEST1'),
       ('TEST1701', 'TEST17', '09:08', '09:13', 'TEST2'),
       ('TEST1801', 'TEST18', '09:16', '09:21', 'TEST1'),
       ('TEST1901', 'TEST19', '09:40', '09:45', 'TEST1'),
       ('TEST2001', 'TEST20', '10:00', '10:05', 'TEST1');
