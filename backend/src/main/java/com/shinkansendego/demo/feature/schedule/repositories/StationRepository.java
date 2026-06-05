package com.shinkansendego.demo.feature.schedule.repositories;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface StationRepository {
    String findStationCdByName(@Param("name") String name);
}
