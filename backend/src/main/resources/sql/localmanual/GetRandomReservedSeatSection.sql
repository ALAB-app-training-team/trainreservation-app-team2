--現在のテーブルに存在するデータから予約済にする席を10,000件ランダムで取得できる
SELECT sch.schedule_cd,
       tc.train_car_cd,
       s.seat_cd,
       da.section_cd
FROM M_Schedule AS sch
         INNER JOIN M_TrainType AS tt ON sch.train_type_cd = tt.train_type_cd
         INNER JOIN M_TrainCar AS tc ON tt.train_series_cd = tc.train_series_cd
         INNER JOIN M_Seat AS s ON tc.seat_type_cd = s.seat_type_cd
         INNER JOIN M_DepartureArrivalTime AS da ON sch.schedule_cd = da.schedule_cd
ORDER BY random() LIMIT 10000;
