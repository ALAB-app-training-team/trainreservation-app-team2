package com.alab.shinkansendego.departurearrivaltime;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

import java.time.*;
import java.util.*;

@Repository
public interface DepartureArrivalTimeRepository extends JpaRepository<DepartureArrivalTimeEntity, String> {

    List<DepartureArrivalTimeEntity> findBySectionCd(String sectionCd);

    DepartureArrivalTimeEntity findByScheduleCdAndSectionCdIn(String scheduleCd, List<String> sectionCdList);

    @Query("SELECT d.sectionCd " +
            "FROM DepartureArrivalTimeEntity d " +
            "WHERE d.scheduleCd= :scheduleCd AND d.departureTime >= :departureTime AND :arrivalTime >= d.arrivalTime")
    List<String> findByScheduleCdAndDepartureTimeAndArrivalTime(String scheduleCd, LocalTime departureTime, LocalTime arrivalTime);
}
