package com.alab.shinkansendego.features.reservation.services;

import com.alab.shinkansendego.features.reservation.dtos.ReservationDto;
import com.alab.shinkansendego.features.reservation.dtos.ReservationResponseDto;
import com.alab.shinkansendego.features.reservation.dtos.ReservedScheduleDto;
import com.alab.shinkansendego.features.reservation.dtos.ReservedSeatDto;
import com.alab.shinkansendego.features.reservation.repositories.PurchaseRepository;
import com.alab.shinkansendego.features.reservation.repositories.PurchasedSeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

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

    public ReservationResponseDto getReservation(UUID request) {

        ReservationResponseDto response = new ReservationResponseDto();

        ReservationDto purchase = purchaseRepository.findPurchaseByPurchaseId(request);
        if (purchase == null) {
            throw new IllegalArgumentException("PurchaseCd is Not Found");
        }

        List<ReservedScheduleDto> scheduleList = purchaseRepository.findScheduleByPurchaseId(request);
        //TODO:Listの1件抽出に変更したい
        List<ReservedScheduleDto> departureSchedule = scheduleList.stream().filter(schedule -> Objects.equals(schedule.getDeparture_station_cd(), purchase.getDeparture_station_cd())).toList();
        List<ReservedScheduleDto> arrivalSchedule = scheduleList.stream().filter(schedule -> Objects.equals(schedule.getArrival_station_cd(), purchase.getArrival_station_cd())).toList();
        if (departureSchedule.size() != 1 || arrivalSchedule.size() != 1) {
            throw new IllegalArgumentException("DepartureAndArrivalStation is Not Found");
        }

        List<ReservedSeatDto> reservedSeatList = purchasedSeatRepository.findReservedSeatByPurchaseId(request);

        response.setTrain_type_name(purchase.getTrain_type_name());
        response.setDeparture_time(departureSchedule.getFirst().getDeparture_time());
        response.setDeparture_station_name(departureSchedule.getFirst().getDeparture_station_name());
        response.setArrival_time(arrivalSchedule.getFirst().getArrival_time());
        response.setArrival_station_name(arrivalSchedule.getFirst().getArrival_station_name());
        response.setRide_date(purchase.getRide_date());
        response.setReserved_seats(reservedSeatList);

        return response;

    }
}
