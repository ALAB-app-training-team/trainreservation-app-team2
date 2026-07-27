ALTER TABLE T_ReservedSeatSection
    ADD COLUMN train_car_type_cd varchar(5);

ALTER TABLE T_ReservedSeatSection
    ALTER COLUMN train_car_type_cd SET NOT NULL;

