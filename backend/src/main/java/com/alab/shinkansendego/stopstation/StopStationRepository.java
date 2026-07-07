package com.alab.shinkansendego.stopstation;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StopStationRepository extends JpaRepository<StopStationEntity, String> {
    @EntityGraph(attributePaths = {"station", "sameCategoryStopStations"})
    List<StopStationEntity> findByStationCd(String stationCd);
}
