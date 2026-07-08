package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;
import com.alab.shinkansendego.reservedseat.ReservedSeatRepository;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ReservedSeatRepository reservedSeatRepository;
    private final SectionKmRepository sectionKmRepository;
    private final DepartureArrivalTimeRepository departureArrivalTimeRepository;
    private final ReservedSeatSectionRepository reservedSeatSectionRepository;

    @Autowired
    public ReservationService(
            ReservationRepository reservationRepository,
            ReservedSeatRepository reservedSeatRepository,
            SectionKmRepository sectionKmRepository,
            DepartureArrivalTimeRepository departureArrivalTimeRepository,
            ReservedSeatSectionRepository reservedSeatSectionRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.reservedSeatRepository = reservedSeatRepository;
        this.sectionKmRepository = sectionKmRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.reservedSeatSectionRepository = reservedSeatSectionRepository;
    }

    public List<ReservationResponseDto> getReservationList() {
        List<ReservationResponseDto> reservationList = new ArrayList<>();
        List<ReservationEntity> purchaseList = reservationRepository.findAll(Sort.by("rideDate").ascending());

        for (ReservationEntity purchase : purchaseList) {
            ReservationResponseDto reservation = getReservation(purchase.getId());
            reservation.setPurchaseId(purchase.getId());
            reservationList.add(reservation);
        }

        return reservationList;
    }

    public ReservationResponseDto getReservation(UUID request) {

        ReservationResponseDto response = new ReservationResponseDto();

        ReservationDto purchase = reservationRepository.findReservationDtoByReservationId(request);
        if (purchase == null) {
            throw new IllegalArgumentException("PurchaseId is Not found");
        }

        List<ReservedScheduleDto> scheduleList = reservationRepository.findReservationScheduleDtoByReservationId(request);
        //TODO:Listの1件抽出に変更したい
        List<ReservedScheduleDto> departureSchedule = scheduleList.stream().filter(schedule -> Objects.equals(schedule.getDepartureStationCd(), purchase.getDepartureStationCd())).toList();
        List<ReservedScheduleDto> arrivalSchedule = scheduleList.stream().filter(schedule -> Objects.equals(schedule.getArrivalStationCd(), purchase.getArrivalStationCd())).toList();
        if (departureSchedule.size() != 1 || arrivalSchedule.size() != 1) {
            throw new IllegalArgumentException("DepartureAndArrivalStation is Not Found");
        }

        List<ReservedSeatDto> reservedSeatList = reservedSeatRepository.findReservedSeatDtoByReservationId(request);

        response.setTrainTypeName(purchase.getTrainTypeName());
        response.setDepartureStationName(departureSchedule.getFirst().getDepartureStationName());
        response.setDepartureTime(departureSchedule.getFirst().getDepartureTime());
        response.setArrivalStationName(arrivalSchedule.getFirst().getArrivalStationName());
        response.setArrivalTime(arrivalSchedule.getFirst().getArrivalTime());
        response.setRideDate(purchase.getRideDate());
        response.setReservedSeats(reservedSeatList);

        return response;

    }

    @Transactional
    public UUID insertReservation(ReserveRequestDto reserveRequestDto) {
        if (reserveRequestDto.getSeats() == null || reserveRequestDto.getSeats().isEmpty()) {
            throw new IllegalArgumentException("Seats is Not found");
        }

        if (reserveRequestDto.getSeats().size() > 6) {
            throw new IllegalArgumentException("Seat limit exceeded");
        }

        List<String> SectionKmCdsByDepartureStation = sectionKmRepository.findSectionCdByStartStationCd(reserveRequestDto.getDepartureStationCd());
        List<String> SectionKmCdsByArrivalStation = sectionKmRepository.findSectionCdByGoalStationCd(reserveRequestDto.getArrivalStationCd());

        DepartureArrivalTimeEntity departureArrivalTimeOfStart = departureArrivalTimeRepository.findByScheduleCdAndSectionCdIn(reserveRequestDto.getScheduleCd(), SectionKmCdsByDepartureStation);
        DepartureArrivalTimeEntity departureArrivalTimeOfGoal = departureArrivalTimeRepository.findByScheduleCdAndSectionCdIn(reserveRequestDto.getScheduleCd(), SectionKmCdsByArrivalStation);
        if (departureArrivalTimeOfStart == null || departureArrivalTimeOfGoal == null) {
            throw new IllegalArgumentException("Section is Not found");
        }

        List<String> sectionCdList =
                departureArrivalTimeRepository.findByScheduleCdAndDepartureTimeAndArrivalTime(reserveRequestDto.getScheduleCd(), departureArrivalTimeOfStart.getDepartureTime(), departureArrivalTimeOfGoal.getArrivalTime());
        if (sectionCdList.isEmpty()) {
            throw new IllegalArgumentException("SectionCd is Not found");
        }

        UUID reservationId = UUID.randomUUID();
        ReservationEntity purchase = new ReservationEntity();
        purchase.setId(reservationId);
        purchase.setRideDate(reserveRequestDto.getRideDate());
        purchase.setScheduleCd(reserveRequestDto.getScheduleCd());
        purchase.setDepartureStationCd(reserveRequestDto.getDepartureStationCd());
        purchase.setArrivalStationCd(reserveRequestDto.getArrivalStationCd());

        ReservationEntity purchaseResult = reservationRepository.save(purchase);
        if (purchaseResult.getId() == null) {
            throw new RuntimeException("Insert Purchase is failed");
        }

        List<ReservedSeatEntity> purchasedSeats = new ArrayList<>();
        for (ReserveRequestDto.SelectedSeatDto seatDto : reserveRequestDto.getSeats()) {
            ReservedSeatEntity purchasedSeat = new ReservedSeatEntity();
            purchasedSeat.setId(UUID.randomUUID());
            purchasedSeat.setReservationId(purchaseResult.getId());
            purchasedSeat.setTrainCarCd(seatDto.getTrainCarCd());
            purchasedSeat.setSeatCd(seatDto.getSeatCd());
            purchasedSeat.setCodeToken(UUID.randomUUID());
            purchasedSeats.add(purchasedSeat);
        }
        int purchasedSeatResult = reservedSeatRepository.saveAll(purchasedSeats).size();
        if (purchasedSeatResult != reserveRequestDto.getSeats().size()) {
            throw new RuntimeException("Insert PurchasedSeats is failed");
        }

        List<ReservedSeatSectionEntity> reservedSeatSections = new ArrayList<>();
        for (ReserveRequestDto.SelectedSeatDto seatDto : reserveRequestDto.getSeats()) {
            for (String sectionCd : sectionCdList) {
                ReservedSeatSectionEntity reservedSeatSection = new ReservedSeatSectionEntity(
                        UUID.randomUUID(), reservationId, reserveRequestDto.getRideDate(), reserveRequestDto.getScheduleCd(),
                        seatDto.getTrainCarCd(),
                        seatDto.getSeatCd(), sectionCd
                );
                reservedSeatSections.add(reservedSeatSection);
            }
        }
        int reservedSeatSectionResult = reservedSeatSectionRepository.saveAll(reservedSeatSections).size();
        if (reservedSeatSectionResult != sectionCdList.size() * reserveRequestDto.getSeats().size()) {
            throw new RuntimeException("Insert ReservedSeatSections is failed");
        }

        return reservationId;
    }
}
