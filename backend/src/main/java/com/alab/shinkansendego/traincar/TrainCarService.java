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
        List<SeatResponseDto> seatList = trainCarRepository.findSeatByTrainCarCd(request.getTrain_car_cd());
        if (seatList.isEmpty()) {
            throw new IllegalArgumentException("TrainCarCd is Not found");
        }

        List<String> seatOfSectionCdList =
                departureArrivalTimeRepository.findSectionCdByScheduleCd(request.getSchedule_cd(), request.getDeparture_time(), request.getArrival_time());
        if (seatOfSectionCdList.isEmpty()) {
            throw new IllegalArgumentException("SectionCdOfSeat is Not found");
        }

        List<String> reservedSeatCdList = new ArrayList<>();
        for (String cd : seatOfSectionCdList) {
            List<String> resultList = reservedSeatSectionRepository.findReservedSeatCdOfTrainCarBySectionCd(request.getDate(), request.getSchedule_cd(), request.getTrain_car_cd(), cd);
            reservedSeatCdList.addAll(resultList);
        }

        for (SeatResponseDto seat : seatList) {
            seat.setIs_reserved(reservedSeatCdList.contains(seat.getSeat_cd()));
        }

        seatList.sort(Comparator.comparing(SeatResponseDto::getSeat_number).thenComparing(SeatResponseDto::getSeat_column));

        return seatList;
    }
}
