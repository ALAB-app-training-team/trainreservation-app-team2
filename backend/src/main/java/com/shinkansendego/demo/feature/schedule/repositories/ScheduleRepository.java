package com.shinkansendego.demo.feature.schedule.repositories;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ScheduleRepository {
    String findTrainTypeNameByScheduleCd(@Param("schedule_cd") String schedule_cd);
}
