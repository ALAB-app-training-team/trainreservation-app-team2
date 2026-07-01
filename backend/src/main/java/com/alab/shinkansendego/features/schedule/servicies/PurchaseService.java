package com.alab.shinkansendego.features.schedule.servicies;

import com.alab.shinkansendego.db.repositories.PurchaseRepository;
import com.alab.shinkansendego.db.repositories.PurchasedSeatRepository;
import com.alab.shinkansendego.features.schedule.dtos.ReserveRequestDto;
import com.alab.shinkansendego.features.schedule.entities.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.features.schedule.entities.PurchaseEntity;
import com.alab.shinkansendego.features.schedule.entities.PurchasedSeatEntity;
import com.alab.shinkansendego.features.schedule.entities.ReservedSeatSectionEntity;
import com.alab.shinkansendego.features.schedule.repositories.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.features.schedule.repositories.ReservedSeatSectionRepository;
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
    private final ReservedSeatSectionRepository reservedSeatSectionRepository;

    @Autowired
    public PurchaseService(PurchaseRepository purchaseRepository, PurchasedSeatRepository purchasedSeatRepository,
                           SectionKmRepository sectionKmRepository,
                           DepartureArrivalTimeRepository departureArrivalTimeRepository,
                           ReservedSeatSectionRepository reservedSeatSectionRepository) {
        this.purchaseRepository = purchaseRepository;
        this.purchasedSeatRepository = purchasedSeatRepository;
        this.sectionKmRepository = sectionKmRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.reservedSeatSectionRepository = reservedSeatSectionRepository;
    }

    @Transactional
    public UUID insertPurchase(ReserveRequestDto reserveRequestDto) {
        if (reserveRequestDto.getSeats() == null || reserveRequestDto.getSeats().isEmpty()) {
            throw new IllegalArgumentException("Seats is Not found");
        }

        if (reserveRequestDto.getSeats().size() > 6) {
            throw new IllegalArgumentException("Seat limit exceeded");
        }

        List<String> SectionKmCdsByDepartureStation = sectionKmRepository.findSectionCdByStartStationCd(reserveRequestDto.getDeparture_station_cd());
        List<String> SectionKmCdsByArrivalStation = sectionKmRepository.findSectionCdByGoalStationCd(reserveRequestDto.getArrival_station_cd());

        DepartureArrivalTimeEntity departureArrivalTimeOfStart = departureArrivalTimeRepository.findScheduleBySectionKmCdAndScheduleCd(SectionKmCdsByDepartureStation, reserveRequestDto.getSchedule_cd());
        DepartureArrivalTimeEntity departureArrivalTimeOfGoal = departureArrivalTimeRepository.findScheduleBySectionKmCdAndScheduleCd(SectionKmCdsByArrivalStation, reserveRequestDto.getSchedule_cd());
        if (departureArrivalTimeOfStart == null || departureArrivalTimeOfGoal == null) {
            throw new IllegalArgumentException("Section is Not found");
        }

        List<String> sectionCdList =
                departureArrivalTimeRepository.findSectionCdByScheduleCd(reserveRequestDto.getSchedule_cd(), departureArrivalTimeOfStart.getDeparture_time(), departureArrivalTimeOfGoal.getArrival_time());
        if (sectionCdList.isEmpty()) {
            throw new IllegalArgumentException("SectionCd is Not found");
        }

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

        List<ReservedSeatSectionEntity> reservedSeatSections = new ArrayList<>();
        for (ReserveRequestDto.SelectedSeatDto seatDto : reserveRequestDto.getSeats()) {
            for (String sectionCd : sectionCdList) {
                ReservedSeatSectionEntity reservedSeatSection = new ReservedSeatSectionEntity(
                        UUID.randomUUID(), purchaseId, reserveRequestDto.getRide_date(), reserveRequestDto.getSchedule_cd(),
                        seatDto.getTrain_car_cd(),
                        seatDto.getSeat_cd(), sectionCd
                );
                reservedSeatSections.add(reservedSeatSection);
            }
        }
        int reservedSeatSectionResult = reservedSeatSectionRepository.insertReservedSeatSections(reservedSeatSections);
        if (reservedSeatSectionResult != sectionCdList.size() * reserveRequestDto.getSeats().size()) {
            throw new RuntimeException("Insert ReservedSeatSections is failed");
        }

        return purchaseId;
    }
}
