ALTER TABLE T_ReservedSeatSection
    ADD COLUMN train_car_type_cd VARCHAR(5);

UPDATE T_ReservedSeatSection
SET train_car_type_cd = 'CAR01'
WHERE train_car_type_cd IS NULL;

ALTER TABLE T_ReservedSeatSection
    ALTER COLUMN train_car_type_cd SET NOT NULL;
