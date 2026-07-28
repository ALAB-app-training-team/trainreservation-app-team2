ALTER TABLE T_ReservedSeatSection
    ADD COLUMN train_car_type_cd varchar(5);

ALTER TABLE T_ReservedSeatSection
    ADD CONSTRAINT t_reservedseatsection_train_car_type_cd_fkey
        FOREIGN KEY (train_car_type_cd) REFERENCES M_TrainCarType (train_car_type_cd)
            ON DELETE CASCADE;

UPDATE T_ReservedSeatSection
    SET train_car_type_cd = 'CAR01'
        WHERE train_car_type_cd IS NULL;

UPDATE T_ReservedSeatSection
    SET train_car_type_cd = 'CAR02'
        WHERE train_car_cd IN ('E2SER09', 'E5SER09', 'E6SER01', 'E7SER11', 'E8SER01');

UPDATE T_ReservedSeatSection
    SET train_car_type_cd = 'CAR03'
        WHERE train_car_cd IN ('E5SER10', 'E7SER12');

ALTER TABLE T_ReservedSeatSection
    ALTER COLUMN train_car_type_cd SET NOT NULL;

