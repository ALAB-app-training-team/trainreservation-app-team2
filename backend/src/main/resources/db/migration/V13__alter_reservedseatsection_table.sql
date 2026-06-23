DELETE
FROM T_ReservedSeatSection;
ALTER TABLE T_ReservedSeatSection
    RENAME COLUMN reserved_seat_id TO id;
ALTER TABLE T_ReservedSeatSection
    ADD COLUMN purchase_id UUID NOT NULL REFERENCES T_Purchase (id) ON DELETE CASCADE;
