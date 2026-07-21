ALTER TABLE T_Reservation RENAME COLUMN is_canceled TO is_deleted;

ALTER TABLE T_ReservedSeat RENAME COLUMN is_canceled TO is_deleted;
