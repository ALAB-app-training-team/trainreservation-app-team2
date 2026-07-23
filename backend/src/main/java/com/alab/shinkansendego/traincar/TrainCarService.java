package com.alab.shinkansendego.traincar;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.farekm.FareKmService;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class TrainCarService {
    private final TrainCarRepository trainCarRepository;
    private final DepartureArrivalTimeRepository departureArrivalTimeRepository;
    private final ReservedSeatSectionRepository reservedSeatSectionRepository;
    private final SectionKmRepository sectionKmRepository;
    private final FareKmService fareKmService;

    @Autowired
    public TrainCarService(
        TrainCarRepository trainCarRepository,
        DepartureArrivalTimeRepository departureArrivalTimeRepository,
        ReservedSeatSectionRepository reservedSeatSectionRepository,
        SectionKmRepository sectionKmRepository,
        FareKmService fareKmService
    ) {
        this.trainCarRepository = trainCarRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.reservedSeatSectionRepository = reservedSeatSectionRepository;
        this.sectionKmRepository = sectionKmRepository;
        this.fareKmService = fareKmService;
    }

    public List<SeatResponseDto> getSeatListWithReserved(SeatRequestDto request) {
        List<SeatResponseDto> seatList = trainCarRepository.findSeatByTrainCarCd(request.getTrainCarCd());
        if (seatList.isEmpty()) {
            throw new IllegalArgumentException("TrainCarCd is Not found");
        }

        List<String> seatOfSectionCdList =
            departureArrivalTimeRepository.findByScheduleCdAndDepartureTimeAndArrivalTime(request.getScheduleCd(), request.getDepartureTime(), request.getArrivalTime());
        if (seatOfSectionCdList.isEmpty()) {
            throw new IllegalArgumentException("SectionCdOfSeat is Not found");
        }

        List<String> reservedSeatCdList = new ArrayList<>();
        for (String cd : seatOfSectionCdList) {
            List<ReservedSeatSectionEntity> reservedSeatSecList = reservedSeatSectionRepository.findByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCdOrderBySeatCd(request.getDate(), request.getScheduleCd(), request.getTrainCarCd(), cd);
            reservedSeatCdList.addAll(reservedSeatSecList.stream().map(ReservedSeatSectionEntity::getSeatCd).toList());
        }

        List<SectionKmEntity> sectionKmList = sectionKmRepository.findBySectionCdIn(seatOfSectionCdList);
        Double distanceKm = sectionKmList.stream().mapToDouble(SectionKmEntity::getDistanceKm).sum();
        TrainCarEntity trainCar = trainCarRepository.findByTrainCarCd(request.getTrainCarCd());
        Integer fare;
        switch (trainCar.getSeatType().getTrainCarType().getName()) {
            case "指定席" -> fare = fareKmService.getFareFromDistance(distanceKm).get("reserved");
            case "グリーン車" -> fare = fareKmService.getFareFromDistance(distanceKm).get("green");
            case "グランクラス" -> fare = fareKmService.getFareFromDistance(distanceKm).get("gran-class");
            default -> fare = 0;
        }

        for (SeatResponseDto seat : seatList) {
            seat.setIsReserved(reservedSeatCdList.contains(seat.getSeatCd()));
            seat.setSeatFare(fare);
        }

        seatList.sort(Comparator.comparing(SeatResponseDto::getSeatNumber).thenComparing(SeatResponseDto::getSeatColumn));

        return seatList;
    }
}
