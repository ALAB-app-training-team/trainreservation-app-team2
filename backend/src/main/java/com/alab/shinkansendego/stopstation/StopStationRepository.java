package com.alab.shinkansendego.stopstation;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StopStationRepository extends JpaRepository<StopStationEntity, String> {
    @EntityGraph(attributePaths = {"station"})
    List<StopStationEntity> findAll();
}
