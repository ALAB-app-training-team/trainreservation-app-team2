package com.alab.shinkansendego.farekm;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BasicFareKmRepository extends JpaRepository<BasicFareKmEntity, String> {
}
