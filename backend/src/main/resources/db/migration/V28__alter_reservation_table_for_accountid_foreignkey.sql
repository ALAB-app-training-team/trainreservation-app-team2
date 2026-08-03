ALTER TABLE T_Reservation
    ADD CONSTRAINT fk_t_reservation_t_account_id
    FOREIGN KEY (account_id) REFERENCES T_Account (id);
    ON DELETE CASCADE;
