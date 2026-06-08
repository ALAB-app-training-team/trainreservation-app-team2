package com.shinkansendego.demo.features.schedule.repositories;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface StationRepository {
    String findStationCdByName(@Param("name") String name);
}
