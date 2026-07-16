package com.alab.shinkansendego.farekm;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpressFareKmRepository extends JpaRepository<ExpressFareKmEntity, String> {
    ExpressFareKmEntity findByMinKmLessThanEqualAndMaxKmGreaterThan(Double km1, Double km2);
}
