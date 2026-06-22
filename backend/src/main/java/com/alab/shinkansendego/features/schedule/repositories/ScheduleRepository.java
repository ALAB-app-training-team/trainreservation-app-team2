package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.dtos.TrainCarFormationResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScheduleRepository {
    String findTrainTypeNameByScheduleCd(@Param("schedule_cd") String schedule_cd);

    List<TrainCarFormationResponseDto> findTrainCarFormationByScheduleCd(@Param("schedule_cd") String scheduleCd);
}
