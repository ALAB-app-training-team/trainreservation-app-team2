package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.dtos.DepartureArrivalTimeDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DepartureArrivalTimeRepository {
    List<DepartureArrivalTimeDto> findScheduleBySectionKmCd(@Param("section_cd") String section_cd);
}
