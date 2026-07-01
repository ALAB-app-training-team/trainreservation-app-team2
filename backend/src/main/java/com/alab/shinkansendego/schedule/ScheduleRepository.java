package com.alab.shinkansendego.schedule;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScheduleRepository {
    String findTrainTypeNameByScheduleCd(@Param("schedule_cd") String schedule_cd);

    List<TrainCarFormationResponseDto> findTrainCarFormationByScheduleCd(@Param("schedule_cd") String scheduleCd);
}
