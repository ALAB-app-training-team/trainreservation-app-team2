package com.alab.shinkansendego.station;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StationRepository {
    List<StationResponseDto> findAllStation();
}
