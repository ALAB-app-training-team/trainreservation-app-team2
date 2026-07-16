package com.alab.shinkansendego.farekm;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplementaryFareKmRepository extends JpaRepository<SupplementaryFareKmEntity, String> {
    SupplementaryFareKmEntity findByMinKmLessThanEqualAndMaxKmGreaterThan(Double km1, Double km2);
}
