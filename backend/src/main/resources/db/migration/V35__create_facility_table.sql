CREATE TABLE M_Facility
(
    facility_cd   VARCHAR(5)   NOT NULL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL
);

INSERT INTO M_Facility (facility_cd, name)
VALUES
    ('FC001', '男女兼用トイレ'),
    ('FC002', '男性用トイレ'),
    ('FC003', '女性用トイレ'),
    ('FC004', '車いす対応トイレ'),
    ('FC005', 'ベビーベッド'),
    ('FC006', '荷物置き場'),
    ('FC007', '多目的室');

