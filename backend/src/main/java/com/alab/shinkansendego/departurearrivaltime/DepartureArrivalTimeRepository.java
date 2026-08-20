package com.alab.shinkansendego.departurearrivaltime;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface DepartureArrivalTimeRepository extends JpaRepository<DepartureArrivalTimeEntity, String> {
    List<DepartureArrivalTimeEntity> findBySectionCd(String sectionCd);

    DepartureArrivalTimeEntity findByScheduleCdAndSectionCdIn(String scheduleCd, List<String> sectionCdList);

    List<DepartureArrivalTimeEntity> findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(
        String scheduleCd,
        LocalTime departureTime,
        LocalTime arrivalTime
    );

    @EntityGraph(attributePaths = {
        "sectionKm"
    })
    List<DepartureArrivalTimeEntity> findByScheduleCd(String scheduleCd);
}
