ALTER TABLE T_ReservedSeat
    ADD COLUMN seat_fare INT;

UPDATE T_ReservedSeat
SET seat_fare = 10000
WHERE seat_fare IS NULL;

ALTER TABLE T_ReservedSeat
    ALTER COLUMN seat_fare SET NOT NULL;
