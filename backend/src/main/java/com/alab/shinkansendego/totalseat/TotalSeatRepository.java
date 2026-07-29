package com.alab.shinkansendego.totalseat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TotalSeatRepository extends JpaRepository<TotalSeatEntity, String> {
}
