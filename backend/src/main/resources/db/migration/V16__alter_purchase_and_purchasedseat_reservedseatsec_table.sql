ALTER TABLE T_Purchase RENAME TO T_Reservation;

ALTER TABLE T_PurchasedSeat RENAME TO T_ReservedSeat;

ALTER TABLE T_ReservedSeatSection RENAME COLUMN purchase_id TO reservation_id;

ALTER TABLE T_ReservedSeat RENAME COLUMN purchase_id TO reservation_id;
