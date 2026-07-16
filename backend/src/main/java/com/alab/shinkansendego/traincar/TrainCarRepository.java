package com.alab.shinkansendego.traincar;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainCarRepository extends JpaRepository<TrainCarEntity, String> {
    @Query("SELECT new com.alab.shinkansendego.traincar.SeatResponseDto(tc.trainCarCd, tc.trainCarNumber, s.seatCd,s.seatNumber, s.seatColumn, 0, false) " +
        "FROM TrainCarEntity tc " +
        "INNER JOIN SeatTypeEntity st ON tc.seatTypeCd = st.seatTypeCd AND tc.trainCarCd = :trainCarCd " +
        "INNER JOIN SeatEntity s ON st.seatTypeCd = s.seatTypeCd ORDER BY s.seatNumber, s.seatColumn")
    List<SeatResponseDto> findSeatByTrainCarCd(String trainCarCd);

    @EntityGraph(attributePaths = {"seatType", "seatType.trainCarType"})
    TrainCarEntity findByTrainCarCd(String trainCarCd);
}
