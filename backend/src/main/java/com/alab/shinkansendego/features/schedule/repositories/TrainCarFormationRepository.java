package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.dtos.SeatResponseDto;
import com.alab.shinkansendego.features.schedule.dtos.TrainCarFormationResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TrainCarFormationRepository {
    List<SeatResponseDto> findSeatByTrainCarCd(@Param("train_car_cd") String train_car_cd);

    List<TrainCarFormationResponseDto> findTrainCarFormationByScheduleCd(@Param("schedule_cd") String scheduleCd);
}
