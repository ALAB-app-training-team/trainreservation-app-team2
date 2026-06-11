package com.alab.shinkansendego.features.schedule.repositories;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SectionKmRepository {
    List<String> findSectionCdByStartStationCd(@Param("start_station_cd") String start_station_cd);

    List<String> findSectionCdByGoalStationCd(@Param("goal_station_cd") String goal_station_cd);
}
