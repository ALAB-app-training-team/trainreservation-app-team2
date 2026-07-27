CREATE OR REPLACE VIEW V_TotalSeat AS
SELECT
    tc.train_series_cd,
    COALESCE(COUNT(CASE WHEN tct.train_car_type_cd = 'CAR01' THEN 1 END), 0) AS reserved_total,
    COALESCE(COUNT(CASE WHEN tct.train_car_type_cd = 'CAR02' THEN 1 END), 0) AS green_total,
    COALESCE(COUNT(CASE WHEN tct.train_car_type_cd = 'CAR03' THEN 1 END), 0) AS gc_total
FROM M_TrainCar tc
JOIN M_SeatType st ON tc.seat_type_cd = st.seat_type_cd
JOIN M_TrainCarType tct ON st.train_car_type_cd = tct.train_car_type_cd
JOIN M_Seat s ON st.seat_type_cd = s.seat_type_cd
GROUP BY tc.train_series_cd;
