package com.alab.shinkansendego.sectionkm;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionKmRepository extends JpaRepository<SectionKmEntity, String> {
    List<SectionKmEntity> findByStartStationCd(String startStationCd);

    List<SectionKmEntity> findByGoalStationCd(String goalStationCd);

    List<SectionKmEntity> findBySectionCdIn(List<String> sectionKmCds);
}
