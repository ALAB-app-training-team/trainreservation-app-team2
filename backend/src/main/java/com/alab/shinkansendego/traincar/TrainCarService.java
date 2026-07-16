package com.alab.shinkansendego.traincar;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
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

    @Autowired
    public TrainCarService(
        TrainCarRepository trainCarRepository,
        DepartureArrivalTimeRepository departureArrivalTimeRepository,
        ReservedSeatSectionRepository reservedSeatSectionRepository) {
        this.trainCarRepository = trainCarRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.reservedSeatSectionRepository = reservedSeatSectionRepository;
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
            List<String> resultList = reservedSeatSectionRepository.findReservedSeatCdByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCd(request.getDate(), request.getScheduleCd(), request.getTrainCarCd(), cd);
            reservedSeatCdList.addAll(resultList);
        }

        for (SeatResponseDto seat : seatList) {
            seat.setIsReserved(reservedSeatCdList.contains(seat.getSeatCd()));
        }

        seatList.sort(Comparator.comparing(SeatResponseDto::getSeatNumber).thenComparing(SeatResponseDto::getSeatColumn));

        return seatList;
    }
}
