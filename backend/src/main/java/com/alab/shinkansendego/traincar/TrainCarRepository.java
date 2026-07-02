package com.alab.shinkansendego.traincar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainCarRepository extends JpaRepository<TrainCarEntity, String> {
    @Query("SELECT SeatResponseDto(tc.train_ca_cd, tc.train_car_number, s.seat_cd,s.seat_number, s.seat_column) FROM M_TrainCar tc " +
            "INNER JOIN M_SeatType AS st ON tc.seat_type_cd=st.seat_type_cd AND tc.train_car_cd=:train_car_cd " +
            "INNER JOIN M_Seat AS s ON st.seat_type_cd=s.seat_type_cd ORDER BY s.seat_number,s.seat_column")
    List<SeatResponseDto> findSeatByTrainCarCd(@Param("trainCarCd") String trainCarCd);
}
