package com.alab.shinkansendego.schedule;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.stereotype.*;

import java.util.*;

@Repository
public interface ScheduleRepository extends JpaRepository<ScheduleEntity, String> {
    @Query("SELECT t.name FROM ScheduleEntity s " +
            "LEFT OUTER JOIN TrainTypeEntity t " +
            "ON s.trainTypeCd = t.trainTypeCd " +
            "WHERE s.scheduleCd = :scheduleCd")
    String findTrainTypeNameByScheduleCd(String scheduleCd);

    @Query("SELECT tc.trainCarCd, tc.trainCarNumber, tc.seatTypeCd, tct.name AS trainCarTypeName " +
            "FROM ScheduleEntity s " +
            "INNER JOIN TrainTypeEntity tt " +
            "ON s.trainTypeCd = tt.trainTypeCd " +
            "INNER JOIN TrainCarEntity tc " +
            "ON tt.trainSeriesCd = tc.trainSeriesCd " +
            "INNER JOIN SeatTypeEntity st " +
            "ON tc.seatTypeCd = st.seatTypeCd " +
            "INNER JOIN TrainCarTypeEntity tct " +
            "ON st.trainCarTypeCd = tct.trainCarTypeCd " +
            "WHERE s.scheduleCd = :scheduleCd " +
            "ORDER BY tc.trainCarNumber ASC")
    List<TrainCarFormationResponseDto> findTrainCarFormationByScheduleCd(String scheduleCd);
}
