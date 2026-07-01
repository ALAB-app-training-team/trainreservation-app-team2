package com.alab.shinkansendego.traincar;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TrainCarRepository {
    List<SeatResponseDto> findSeatByTrainCarCd(@Param("train_car_cd") String train_car_cd);
}
