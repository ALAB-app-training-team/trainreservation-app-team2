ALTER TABLE M_TrainType
    ADD COLUMN train_car_cd VARCHAR(5) NOT NULL;

ALTER TABLE M_TrainType
    ADD CONSTRAINT fk_traintype_trainseries
        FOREIGN KEY (train_car_cd)
            REFERENCES M_TrainSeries (train_car_cd)
            ON DELETE RESTRICT NOT VALID;

--既存レコードの更新
UPDATE M_TrainType SET train_car_cd='E5SER' WHERE train_type_cd LIKE 'HB%';
UPDATE M_TrainType SET train_car_cd='E5SER' WHERE train_type_cd LIKE 'YM%';
UPDATE M_TrainType SET train_car_cd='E5SER' WHERE train_type_cd LIKE 'NS%';
UPDATE M_TrainType SET train_car_cd='E6SER' WHERE train_type_cd LIKE 'KM%';
UPDATE M_TrainType SET train_car_cd='E7SER' WHERE train_type_cd LIKE 'KK%';
UPDATE M_TrainType SET train_car_cd='E7SER' WHERE train_type_cd LIKE 'HT%';
UPDATE M_TrainType SET train_car_cd='E7SER' WHERE train_type_cd LIKE 'AS%';
UPDATE M_TrainType SET train_car_cd='E7SER' WHERE train_type_cd LIKE 'TK%';
UPDATE M_TrainType SET train_car_cd='E7SER' WHERE train_type_cd LIKE 'TN%';
UPDATE M_TrainType SET train_car_cd='E8SER' WHERE train_type_cd LIKE 'TB%';