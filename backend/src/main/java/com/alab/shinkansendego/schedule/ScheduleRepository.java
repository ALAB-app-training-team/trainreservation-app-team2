package com.alab.shinkansendego.schedule;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<ScheduleEntity, String> {
    @EntityGraph(attributePaths = {
        "trainType",
        "trainType.trainSeries",
        "trainType.trainSeries.trainCars",
        "trainType.trainSeries.trainCars.seatType",
        "trainType.trainSeries.trainCars.seatType.trainCarType",
    })
    Optional<ScheduleEntity> findByScheduleCd(String scheduleCd);
}
