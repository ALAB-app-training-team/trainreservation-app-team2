package com.alab.shinkansendego.traincarfacility;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainCarFacilityRepository extends JpaRepository<TrainCarFacilityEntity, String> {
    @EntityGraph(attributePaths = {
        "facility"
    })
    List<TrainCarFacilityEntity> findByTrainCarCd(String trainCarCd);
}
