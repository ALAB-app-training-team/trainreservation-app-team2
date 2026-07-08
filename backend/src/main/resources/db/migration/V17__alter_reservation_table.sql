ALTER TABLE T_Reservation
ADD COLUMN reserver_name VARCHAR(255),
ADD COLUMN reserver_mail VARCHAR(255),
ADD COLUMN payment_tracking_id VARCHAR(36);

UPDATE T_Reservation
SET payment_tracking_id = ''
WHERE payment_tracking_id IS NULL;

ALTER TABLE T_Reservation
ALTER COLUMN payment_tracking_id SET NOT NULL;
