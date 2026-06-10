package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.dtos.StationResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StationRepository {
    String findStationCdByName(@Param("name") String name);

    List<StationResponseDto> findAllStationCdAndName();
}
