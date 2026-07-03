package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.purchase.*;
import com.alab.shinkansendego.purchasedseat.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final PurchaseRepository purchaseRepository;
    private final PurchasedSeatRepository purchasedSeatRepository;

    @Autowired
    public ReservationService(
            PurchaseRepository purchaseRepository,
            PurchasedSeatRepository purchasedSeatRepository
    ) {
        this.purchaseRepository = purchaseRepository;
        this.purchasedSeatRepository = purchasedSeatRepository;
    }

    public List<ReservationResponseDto> getReservationList(){
        List<ReservationResponseDto> reservationList =new ArrayList<>();
        List<PurchaseEntity> purchaseList=purchaseRepository.findAll();

        for(PurchaseEntity purchase:purchaseList){
            ReservationResponseDto reservation=getReservation(purchase.getId());
            reservation.setPurchaseId(purchase.getId());
            reservationList.add(reservation);
        }

        return reservationList;
    }

    public ReservationResponseDto getReservation(UUID request) {

        ReservationResponseDto response = new ReservationResponseDto();

        ReservationDto purchase = purchaseRepository.findReservationDtoByPurchaseId(request);
        if (purchase == null) {
            throw new IllegalArgumentException("PurchaseId is Not found");
        }

        List<ReservedScheduleDto> scheduleList = purchaseRepository.findReservationScheduleDtoByPurchaseId(request);
        //TODO:Listの1件抽出に変更したい
        List<ReservedScheduleDto> departureSchedule = scheduleList.stream().filter(schedule -> Objects.equals(schedule.getDepartureStationCd(), purchase.getDepartureStationCd())).toList();
        List<ReservedScheduleDto> arrivalSchedule = scheduleList.stream().filter(schedule -> Objects.equals(schedule.getArrivalStationCd(), purchase.getArrivalStationCd())).toList();
        if (departureSchedule.size() != 1 || arrivalSchedule.size() != 1) {
            throw new IllegalArgumentException("DepartureAndArrivalStation is Not Found");
        }

        List<ReservedSeatDto> reservedSeatList = purchasedSeatRepository.findReservedSeatDtoByPurchaseId(request);

        response.setTrainTypeName(purchase.getTrainTypeName());
        response.setDepartureStationName(departureSchedule.getFirst().getDepartureStationName());
        response.setDepartureTime(departureSchedule.getFirst().getDepartureTime());
        response.setArrivalStationName(arrivalSchedule.getFirst().getArrivalStationName());
        response.setArrivalTime(arrivalSchedule.getFirst().getArrivalTime());
        response.setRideDate(purchase.getRideDate());
        response.setReservedSeats(reservedSeatList);

        return response;

    }
}
