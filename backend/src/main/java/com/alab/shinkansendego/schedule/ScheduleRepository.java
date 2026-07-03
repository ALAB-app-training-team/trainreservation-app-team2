package com.alab.shinkansendego.schedule;

import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.stereotype.*;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<ScheduleEntity, String>{
    @Query("SELECT t.name FROM ScheduleEntity s " +
            "LEFT OUTER JOIN TrainTypeEntity t " +
            "ON s.trainTypeCd = t.trainTypeCd " +
            "WHERE s.scheduleCd = :scheduleCd")
    String findTrainTypeNameByScheduleCd(@Param("scheduleCd") String scheduleCd);

    @Query("SELECT tc.trainCarCd, tc.trainCarNumber, tc.seatTypeCd, tct.name AS trainCarTypeName " +
            "FROM ScheduleEntity s " +
            "INNER JOIN TrainTypeEntity tt " +
            "ON s.trainTypeCd = tt.trainTypeCd " +
            "INNER JOIN TrainCarEntity tc " +
            "ON tt.trainSeriesCd = tc.trainSeriesCd " +
            "INNER JOIN SeatTypeEnityt st " +
            "ON tc.seatTypeCd = st.seatTypeCd " +
            "INNER JOIN TrainCarTypeEntity tct " +
            "ON st.trainCarTypeCd = tct.trainCarTypeCd " +
            "WHERE s.schedule_Cd = :scheduleCd " +
            "ORDER BY tc.trainCarNumber ASC")
    List<TrainCarFormationResponseDto> findTrainCarFormationByScheduleCd(@Param("scheduleCd") String scheduleCd);
}
