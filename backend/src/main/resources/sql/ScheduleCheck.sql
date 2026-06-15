--ダイヤを駅名表示で確認するためのSQL
SELECT da.time_cd,
       da.schedule_cd,
       da.departure_time,
       da.arrival_time,
       sch.train_type_cd,
       t.name,
       sec.start_station_cd,
       s1.name,
       sec.goal_station_cd,
       s2.name
FROM M_DEPARTUREARRIVALTIME AS da
         LEFT OUTER JOIN M_SCHEDULE AS sch ON da.schedule_cd = sch.schedule_cd
         LEFT OUTER JOIN M_TRAINTYPE AS t ON sch.train_type_cd = t.train_type_cd
         LEFT OUTER JOIN M_SECTIONKM AS sec ON da.section_cd = sec.section_cd
         LEFT OUTER JOIN M_STATION AS s1 ON sec.start_station_cd = s1.station_cd
         LEFT OUTER JOIN M_STATION AS s2 ON sec.goal_station_cd = s2.station_cd;
         