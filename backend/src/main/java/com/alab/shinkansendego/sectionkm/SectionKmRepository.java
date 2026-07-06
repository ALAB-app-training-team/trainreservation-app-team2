package com.alab.shinkansendego.sectionkm;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionKmRepository extends JpaRepository<SectionKmEntity, String> {
    @Query("SELECT sk.sectionCd FROM SectionKmEntity sk WHERE sk.startStationCd = :startStationCd")
    List<String> findSectionCdByStartStationCd(String startStationCd);

    @Query("SELECT sk.sectionCd FROM SectionKmEntity sk WHERE sk.goalStationCd = :goalStationCd")
    List<String> findSectionCdByGoalStationCd(String goalStationCd);
}
