package com.alab.shinkansendego.reservedseatsection;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ReservedSeatSectionRepository {
    List<String> findReservedSeatCdOfTrainCarBySectionCd
            (@Param("ride_date") LocalDate ride_date,
             @Param("schedule_cd") String schedule_cd,
             @Param("train_car_cd") String train_car_cd,
             @Param("reserved_section_cd") String section_cd);

    int insertReservedSeatSections(List<ReservedSeatSectionEntity> reservedSeatSections);
}
