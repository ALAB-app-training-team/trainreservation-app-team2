DELETE
FROM T_ReservedSeatSection;
ALTER TABLE T_ReservedSeatSection DROP COLUMN reserved_seat_id;
ALTER TABLE T_ReservedSeatSection
    ADD COLUMN id UUID PRIMARY KEY;
ALTER TABLE T_ReservedSeatSection
    ADD COLUMN purchase_id UUID NOT NULL REFERENCES T_Purchase (id) ON DELETE CASCADE;
