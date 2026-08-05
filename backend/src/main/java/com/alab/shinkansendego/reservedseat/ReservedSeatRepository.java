package com.alab.shinkansendego.reservedseat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReservedSeatRepository extends JpaRepository<ReservedSeatEntity, UUID> {
    List<ReservedSeatEntity> findByReservationId(UUID reservationId);

    List<ReservedSeatEntity> findByReservationIdAndIsDeleted(UUID reservationId, Boolean flag);
}
