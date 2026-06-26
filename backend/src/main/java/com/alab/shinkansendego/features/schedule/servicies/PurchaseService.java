package com.alab.shinkansendego.features.schedule.servicies;

import com.alab.shinkansendego.features.schedule.dtos.ReserveRequestDto;
import com.alab.shinkansendego.features.schedule.entities.PurchaseEntity;
import com.alab.shinkansendego.features.schedule.entities.PurchasedSeatEntity;
import com.alab.shinkansendego.features.schedule.repositories.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.features.schedule.repositories.PurchaseRepository;
import com.alab.shinkansendego.features.schedule.repositories.PurchasedSeatRepository;
import com.alab.shinkansendego.features.schedule.repositories.SectionKmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PurchaseService {
    private final PurchaseRepository purchaseRepository;
    private final PurchasedSeatRepository purchasedSeatRepository;
    private final SectionKmRepository sectionKmRepository;
    private final DepartureArrivalTimeRepository departureArrivalTimeRepository;

    @Autowired
    public PurchaseService(PurchaseRepository purchaseRepository, PurchasedSeatRepository purchasedSeatRepository, SectionKmRepository sectionKmRepository, DepartureArrivalTimeRepository departureArrivalTimeRepository) {
        this.purchaseRepository = purchaseRepository;
        this.purchasedSeatRepository = purchasedSeatRepository;
        this.sectionKmRepository = sectionKmRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
    }

    @Transactional
    public UUID insertPurchaseSeats(ReserveRequestDto reserveRequestDto) {
        if (reserveRequestDto.getSeats() == null || reserveRequestDto.getSeats().isEmpty()) {
            throw new IllegalArgumentException("Seats is Not found");
        }

        List<String> SectionKmCdsByDepartureStation = sectionKmRepository.findSectionCdByStartStationCd(reserveRequestDto.getDeparture_station_cd());
        List<String> SectionKmCdsByArrivalStation = sectionKmRepository.findSectionCdByGoalStationCd(reserveRequestDto.getArrival_station_cd());



        UUID purchaseId = UUID.randomUUID();
        PurchaseEntity purchase = new PurchaseEntity(
                purchaseId,
                reserveRequestDto.getRide_date(),
                reserveRequestDto.getSchedule_cd(),
                reserveRequestDto.getDeparture_station_cd(),
                reserveRequestDto.getArrival_station_cd()
        );
        int purchaseResult = purchaseRepository.insertPurchase(purchase);
        if (purchaseResult != 1) {
            throw new RuntimeException("Insert Purchase is failed");
        }

        List<PurchasedSeatEntity> purchasedSeats = new ArrayList<>();
        for (ReserveRequestDto.SelectedSeatDto seatDto : reserveRequestDto.getSeats()) {
            PurchasedSeatEntity purchasedSeat = new PurchasedSeatEntity(
                    UUID.randomUUID(), purchaseId, seatDto.getTrain_car_cd(), seatDto.getSeat_cd(), UUID.randomUUID()
            );
            purchasedSeats.add(purchasedSeat);
        }
        int purchasedSeatResult = purchasedSeatRepository.insertPurchasedSeats(purchasedSeats);
        if (purchasedSeatResult != reserveRequestDto.getSeats().size()) {
            throw new RuntimeException("Insert PurchasedSeats is failed");
        }

        return purchaseId;
    }
}
