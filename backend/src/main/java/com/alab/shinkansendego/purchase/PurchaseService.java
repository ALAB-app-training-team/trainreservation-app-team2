package com.alab.shinkansendego.purchase;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.purchasedseat.PurchasedSeatEntity;
import com.alab.shinkansendego.purchasedseat.PurchasedSeatRepository;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
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

        DepartureArrivalTimeEntity departureArrivalTimeOfStart = departureArrivalTimeRepository.findByScheduleCdAndSectionCdIn(reserveRequestDto.getSchedule_cd(), SectionKmCdsByDepartureStation);
        DepartureArrivalTimeEntity departureArrivalTimeOfGoal = departureArrivalTimeRepository.findByScheduleCdAndSectionCdIn(reserveRequestDto.getSchedule_cd(), SectionKmCdsByArrivalStation);
        if (departureArrivalTimeOfStart == null || departureArrivalTimeOfGoal == null) {
            throw new IllegalArgumentException("Section is Not found");
        }

        List<String> sectionCdList =
                departureArrivalTimeRepository.findByScheduleCdAndDepartureTimeAndArrivalTime(reserveRequestDto.getSchedule_cd(), departureArrivalTimeOfStart.getDepartureTime(), departureArrivalTimeOfGoal.getArrivalTime());
        if (sectionCdList.isEmpty()) {
            throw new IllegalArgumentException("SectionCd is Not found");
        }

        UUID purchaseId = UUID.randomUUID();
        PurchaseEntity purchase = new PurchaseEntity();
        purchase.setId(purchaseId);
        purchase.setRideDate(reserveRequestDto.getRide_date());
        purchase.setScheduleCd(reserveRequestDto.getSchedule_cd());
        purchase.setDepartureStationCd(reserveRequestDto.getDeparture_station_cd());
        purchase.setArrivalStationCd(reserveRequestDto.getArrival_station_cd());

        PurchaseEntity purchaseResult = purchaseRepository.save(purchase);
        if (purchaseResult.getId() != null) {
            throw new RuntimeException("Insert Purchase is failed");
        }

        List<PurchasedSeatEntity> purchasedSeats = new ArrayList<>();
        for (ReserveRequestDto.SelectedSeatDto seatDto : reserveRequestDto.getSeats()) {
            PurchasedSeatEntity purchasedSeat = new PurchasedSeatEntity();
            purchasedSeat.setId(UUID.randomUUID());
            purchasedSeat.setPurchaseId(purchaseResult.getId());
            purchasedSeat.setTrainCarCd(seatDto.getTrain_car_cd());
            purchasedSeat.setSeatCd(seatDto.getSeat_cd());
            purchasedSeat.setCodeToken(UUID.randomUUID());
            purchasedSeats.add(purchasedSeat);
        }
        int purchasedSeatResult = purchasedSeatRepository.saveAll(purchasedSeats).size();
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
