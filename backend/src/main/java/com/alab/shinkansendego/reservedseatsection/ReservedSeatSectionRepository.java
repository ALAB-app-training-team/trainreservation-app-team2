package com.alab.shinkansendego.reservedseatsection;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.stereotype.*;

import java.time.*;
import java.util.*;

@Repository
public interface ReservedSeatSectionRepository extends JpaRepository<ReservedSeatSectionEntity, UUID> {

    @Query("SELECT rss.seatCd " +
            "FROM ReservedSeatSectionEntity rss " +
            "WHERE rss.rideDate = :rideDate AND rss.scheduleCd = :scheduleCd AND rss.trainCarCd = :trainCarCd AND rss.reservedSectionCd = :sectionCd " +
            "ORDER BY rss.seatCd")
    List<String> findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd
            (@Param("rideDate") LocalDate rideDate,
             @Param("scheduleCd") String scheduleCd,
             @Param("trainCarCd") String trainCarCd,
             @Param("sectionCd") String sectionCd);
}
