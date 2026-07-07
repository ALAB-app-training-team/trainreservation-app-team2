ALTER TABLE T_Reservation
    ADD COLUMN reserver_name VARCHAR(255),
ADD COLUMN reserver_mail VARCHAR(255),
ADD COLUMN payment_tracking_number VARCHAR(36) NOT NULL;
