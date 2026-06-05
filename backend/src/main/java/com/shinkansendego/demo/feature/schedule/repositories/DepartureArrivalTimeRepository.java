package com.shinkansendego.demo.feature.schedule.repositories;

import com.shinkansendego.demo.feature.schedule.dtos.DepartureArrivalTimeDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DepartureArrivalTimeRepository {
    List<DepartureArrivalTimeDto> findScheduleBySectionKmCd(@Param("section_cd") String section_cd);
}
