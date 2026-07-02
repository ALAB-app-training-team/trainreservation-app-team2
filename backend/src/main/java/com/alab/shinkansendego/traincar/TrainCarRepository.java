package com.alab.shinkansendego.traincar;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.stereotype.*;

import java.util.List;

@Repository
public interface TrainCarRepository  extends JpaRepository<TrainCarEntity, String> {
    @Query("SELECT SeatResponseDto(tc.trainCarCd, tc.trainCarNumber, s.seatCd,s.seatNumber, s.seatColumn) FROM TrainCarEntity tc " +
            "INNER JOIN SeatTypeEntity AS st ON tc.seatTypeCd = st.seatTypeCd AND tc.trainCarCd= :trainCarCd " +
            "INNER JOIN SeatEntity AS s ON st.seatTypeCd=s.seatTypeCd ORDER BY s.seatNumber,s.seatColumn")
    List<SeatResponseDto> findSeatByTrainCarCd(@Param("trainCarCd")String trainCarCd);
}
