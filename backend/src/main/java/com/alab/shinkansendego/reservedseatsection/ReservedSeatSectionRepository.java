package com.alab.shinkansendego.reservedseatsection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReservedSeatSectionRepository extends JpaRepository<ReservedSeatSectionEntity, UUID> {

    @Query("SELECT d.sectionCd "+
           "FROM ReservedSeatSection rss "+
           "WHERE rss.rideDate= :rideDate AND rss.scheduleCd = :scheduleCd AND rss.trainCarCd = :trainCarCd AND rss.reservedSectionCd = :reservedSectionCd "+
           "ORDER BY rss.seatCd")
    List<String> findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd
            (LocalDate rideDate,
             String scheduleCd,
             String trainCarCd,
             String sectionCd);
}
