package com.alab.shinkansendego.sectionkm;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.stereotype.*;

import java.util.*;

@Repository
public interface SectionKmRepository extends JpaRepository<SectionKmEntity, String> {
    @Query("SELECT sk.sectionCd FROM SectionKmEntity sk WHERE sk.startStationCd = :startStationCd")
    List<String> findSectionCdByStartStationCd(@Param("startStationCd") String startStationCd);

    @Query("SELECT sk.sectionCd FROM SectionKmEntity sk WHERE sk.goalStationCd = :goalStationCd")
    List<String> findSectionCdByGoalStationCd(@Param("goalStationCd") String goalStationCd);
}
