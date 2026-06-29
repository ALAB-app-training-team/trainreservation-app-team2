package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.dtos.DepartureArrivalTimeDto;
import com.alab.shinkansendego.features.schedule.entities.DepartureArrivalTimeEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalTime;
import java.util.List;

@Mapper
public interface DepartureArrivalTimeRepository {
    List<DepartureArrivalTimeDto> findScheduleBySectionKmCd(@Param("section_cd") String section_cd);

    DepartureArrivalTimeEntity findScheduleBySectionKmCdAndScheduleCd(@Param("section_cd_list") List<String> section_cd_list, @Param("schedule_cd") String schedule_cd);

    List<String> findSectionCdByScheduleCd(@Param("schedule_cd") String schedule_cd,
                                           @Param("departure_time") LocalTime departure_time,
                                           @Param("arrival_time") LocalTime arrival_time);
}
