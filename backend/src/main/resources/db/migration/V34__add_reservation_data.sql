--Playwrightで使用する過去予約データ（一般太郎 / 2026-01-01 東京→上野 はやぶさ21号 11:56発 12:01着 / 指定席2席）
INSERT INTO T_Reservation (id, ride_date, schedule_cd, departure_station_cd, arrival_station_cd,
                           reserver_name, reserver_mail, payment_tracking_id, is_deleted, account_id)
VALUES ('2dcc101c-6cf6-4e69-b969-d86faa8ac1ac', '2026-01-01', 'THK030', 'THK01', 'THK02',
        '', '', 'c2ef1235-1f6e-4795-a6e6-519dd8186d8f', FALSE, 'c1d61acd-2e46-4d55-b026-ee1d4dbcb5ce');

INSERT INTO T_ReservedSeat (id, reservation_id, train_car_cd, seat_cd, code_token, seat_fare, is_deleted, name, mail)
VALUES (gen_random_uuid(), '2dcc101c-6cf6-4e69-b969-d86faa8ac1ac', 'E5SER01', 'SEAT01001',
        '04ca0549-eeb4-43c5-8111-b51dbbfbf888', 2600, FALSE, '一般太郎', 'test-common@test.com'),
       (gen_random_uuid(), '2dcc101c-6cf6-4e69-b969-d86faa8ac1ac', 'E5SER01', 'SEAT01002',
        'ef67305f-2b01-4fee-8efb-91da31ec329f', 2600, FALSE, '一般太郎', 'test-common@test.com');

INSERT INTO T_ReservedSeatSection (id, reservation_id, ride_date, schedule_cd, train_car_cd, seat_cd,
                                   reserved_section_cd, train_car_type_cd)
VALUES (gen_random_uuid(), '2dcc101c-6cf6-4e69-b969-d86faa8ac1ac', '2026-01-01', 'THK030',
        'E5SER01', 'SEAT01001', 'THK01', 'CAR01'),
       (gen_random_uuid(), '2dcc101c-6cf6-4e69-b969-d86faa8ac1ac', '2026-01-01', 'THK030',
        'E5SER01', 'SEAT01002', 'THK01', 'CAR01');
