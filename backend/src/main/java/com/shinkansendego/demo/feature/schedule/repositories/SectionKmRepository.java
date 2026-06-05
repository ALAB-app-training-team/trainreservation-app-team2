package com.shinkansendego.demo.feature.schedule.repositories;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SectionKmRepository {
    List<String> findSectionCdByStartStation(@Param("start_station_cd") String start_station_cd);

    List<String> findSectionCdByGoalStation(@Param("goal_station_cd") String goal_station_cd);
}
