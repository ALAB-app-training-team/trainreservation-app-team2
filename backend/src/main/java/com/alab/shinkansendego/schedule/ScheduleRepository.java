package com.alab.shinkansendego.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<ScheduleEntity, String> {
    @Query("SELECT new com.alab.shinkansendego.schedule.TrainCarFormationResponseDto(tc.trainCarCd, tc.trainCarNumber, tc.seatTypeCd, tct.name) " +
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
