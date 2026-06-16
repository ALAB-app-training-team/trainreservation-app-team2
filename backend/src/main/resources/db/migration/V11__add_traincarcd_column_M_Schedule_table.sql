ALTER TABLE M_TrainType
    ADD COLUMN train_car_cd VARCHAR(5) NOT NULL;
ALTER TABLE M_TrainType
    ADD CONSTRAINT fk_traintype_trainseries
        FOREIGN KEY (train_car_cd)
        REFERENCES M_TrainSeries (train_car_cd)
        ON DELETE RESTRICT;