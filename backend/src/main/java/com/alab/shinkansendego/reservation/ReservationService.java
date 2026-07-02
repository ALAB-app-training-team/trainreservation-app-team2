package com.alab.shinkansendego.reservation;

import com.alab.shinkansendego.purchase.*;
import com.alab.shinkansendego.purchasedseat.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import java.util.*;

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

        response.setTrain_type_name(purchase.getTrainTypeName());
        response.setDeparture_station_name(departureSchedule.getFirst().getDepartureStationName());
        response.setDeparture_time(departureSchedule.getFirst().getDepartureTime());
        response.setArrival_station_name(arrivalSchedule.getFirst().getArrivalStationName());
        response.setArrival_time(arrivalSchedule.getFirst().getArrivalTime());
        response.setRide_date(purchase.getRideDate());
        response.setReserved_seats(reservedSeatList);

        return response;

    }
}
