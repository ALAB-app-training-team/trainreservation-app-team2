package com.alab.shinkansendego.departurearrivaltime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface DepartureArrivalTimeRepository extends JpaRepository<DepartureArrivalTimeEntity, String> {

    List<DepartureArrivalTimeEntity> findBySectionCd(String sectionCd);

    DepartureArrivalTimeEntity findByScheduleCdAndSectionCdIn(String scheduleCd, List<String> sectionCdList);

    @Query("SELECT d.sectionCd " +
            "FROM DepartureArrivalTimeEntity d " +
            "WHERE d.scheduleCd= :scheduleCd AND d.departureTime >= :departureTime AND :arrivalTime >= d.arrivalTime")
    List<String> findByScheduleCdAndDepartureTimeAndArrivalTime(String scheduleCd, LocalTime departureTime, LocalTime arrivalTime);
}
