package com.alab.shinkansendego.station;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<StationEntity, String> {
    List<StationEntity> findAll();
}
