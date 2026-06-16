ALTER TABLE M_TrainType
    ADD COLUMN train_series_cd VARCHAR(5);

ALTER TABLE M_TrainType
    ADD CONSTRAINT fk_traintype_trainseries
        FOREIGN KEY (train_series_cd)
            REFERENCES M_TrainSeries (train_series_cd)
            ON DELETE RESTRICT;

--既存レコード更新のためのデータ追加
INSERT INTO M_TrainSeries (train_series_cd, name)
VALUES ('E2SER', 'E2系'),
       ('E5SER', 'E5系'),
       ('E6SER', 'E6系'),
       ('E7SER', 'E7系'),
       ('E8SER', 'E8系');

--既存レコードの更新
UPDATE M_TrainType
SET train_series_cd='E5SER'
WHERE train_type_cd LIKE 'HB%';
UPDATE M_TrainType
SET train_series_cd='E5SER'
WHERE train_type_cd LIKE 'YM%';
UPDATE M_TrainType
SET train_series_cd='E5SER'
WHERE train_type_cd LIKE 'NS%';
UPDATE M_TrainType
SET train_series_cd='E6SER'
WHERE train_type_cd LIKE 'KM%';
UPDATE M_TrainType
SET train_series_cd='E7SER'
WHERE train_type_cd LIKE 'KK%';
UPDATE M_TrainType
SET train_series_cd='E7SER'
WHERE train_type_cd LIKE 'HT%';
UPDATE M_TrainType
SET train_series_cd='E7SER'
WHERE train_type_cd LIKE 'AS%';
UPDATE M_TrainType
SET train_series_cd='E7SER'
WHERE train_type_cd LIKE 'TK%';
UPDATE M_TrainType
SET train_series_cd='E7SER'
WHERE train_type_cd LIKE 'TN%';
UPDATE M_TrainType
SET train_series_cd='E8SER'
WHERE train_type_cd LIKE 'TB%';

ALTER TABLE M_TrainType
    ALTER COLUMN train_series_cd SET NOT NULL;
