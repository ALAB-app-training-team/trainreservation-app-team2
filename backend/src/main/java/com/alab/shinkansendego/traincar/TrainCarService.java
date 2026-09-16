package com.alab.shinkansendego.traincar;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.farekm.FareKmService;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import com.alab.shinkansendego.traincarfacility.TrainCarFacilityEntity;
import com.alab.shinkansendego.traincarfacility.TrainCarFacilityRepository;
import com.alab.shinkansendego.utils.FacilityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class TrainCarService {
    private final TrainCarRepository trainCarRepository;
    private final DepartureArrivalTimeRepository departureArrivalTimeRepository;
    private final ReservedSeatSectionRepository reservedSeatSectionRepository;
    private final SectionKmRepository sectionKmRepository;
    private final TrainCarFacilityRepository trainCarFacilityRepository;
    private final FareKmService fareKmService;

    @Autowired
    public TrainCarService(
        TrainCarRepository trainCarRepository,
        DepartureArrivalTimeRepository departureArrivalTimeRepository,
        ReservedSeatSectionRepository reservedSeatSectionRepository,
        SectionKmRepository sectionKmRepository,
        TrainCarFacilityRepository trainCarFacilityRepository,
        FareKmService fareKmService
    ) {
        this.trainCarRepository = trainCarRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.reservedSeatSectionRepository = reservedSeatSectionRepository;
        this.sectionKmRepository = sectionKmRepository;
        this.trainCarFacilityRepository = trainCarFacilityRepository;
        this.fareKmService = fareKmService;
    }

    public SeatResponseDto getSeatListWithReserved(SeatRequestDto request) {
        List<SeatDto> seatList = trainCarRepository.findSeatByTrainCarCd(request.getTrainCarCd());
        if (seatList.isEmpty()) {
            throw new IllegalArgumentException("TrainCarCd is Not found");
        }

        List<String> seatOfSectionCdList =
            departureArrivalTimeRepository.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(
                    request.getScheduleCd(), request.getDepartureTime(), request.getArrivalTime())
                .stream().map(DepartureArrivalTimeEntity::getSectionCd).toList();
        if (seatOfSectionCdList.isEmpty()) {
            throw new IllegalArgumentException("SectionCdOfSeat is Not found");
        }

        List<String> reservedSeatCdList = new ArrayList<>();
        for (String sectionCd : seatOfSectionCdList) {
            List<ReservedSeatSectionEntity> reservedSeatSecList = reservedSeatSectionRepository.findByRideDateAndScheduleCdAndTrainCarCdAndReservedSectionCdOrderBySeatCd(request.getDate(), request.getScheduleCd(), request.getTrainCarCd(), sectionCd);
            reservedSeatCdList.addAll(reservedSeatSecList.stream().map(ReservedSeatSectionEntity::getSeatCd).toList());
        }

        List<SectionKmEntity> sectionKmList = sectionKmRepository.findBySectionCdIn(seatOfSectionCdList);
        Double distanceKm = sectionKmList.stream().mapToDouble(SectionKmEntity::getDistanceKm).sum();
        TrainCarEntity trainCar = trainCarRepository.findByTrainCarCd(request.getTrainCarCd()).orElseThrow(() -> new IllegalArgumentException("TrainCar is Not found"));
        Integer fare;
        switch (trainCar.getSeatType().getTrainCarType().getName()) {
            case "指定席" -> fare = fareKmService.getFareFromDistance(distanceKm).get("reserved");
            case "グリーン車" -> fare = fareKmService.getFareFromDistance(distanceKm).get("green");
            case "グランクラス" -> fare = fareKmService.getFareFromDistance(distanceKm).get("gran-class");
            default -> fare = 0;
        }

        for (SeatDto seat : seatList) {
            seat.setIsReserved(reservedSeatCdList.contains(seat.getSeatCd()));
            seat.setSeatFare(fare);
        }
        seatList.sort(Comparator.comparing(SeatDto::getSeatNumber).thenComparing(SeatDto::getSeatColumn));

        List<TrainCarFacilityEntity> facilities = trainCarFacilityRepository.findByTrainCarCd(trainCar.getTrainCarCd());
        List<TrainCarFacilityEntity> frontFacilities = facilities.stream()
            .filter(facility -> Objects.equals(facility.getPosition(), FacilityUtils.POSITION_FRONT)).toList();
        List<TrainCarFacilityEntity> rearFacilities = facilities.stream()
            .filter(facility -> Objects.equals(facility.getPosition(), FacilityUtils.POSITION_REAR)).toList();

        FacilityDto frontDto = new FacilityDto(FacilityUtils.POSITION_FRONT, false, false, false, false, false, false, false);
        FacilityDto rearDto = new FacilityDto(FacilityUtils.POSITION_REAR, false, false, false, false, false, false, false);

        if (!frontFacilities.isEmpty()) {
            for (TrainCarFacilityEntity facility : frontFacilities) {
                FacilityUtils.setFacilityDto(frontDto, facility.getFacility().getName());
            }
        }
        if (!rearFacilities.isEmpty()) {
            for (TrainCarFacilityEntity facility : rearFacilities) {
                FacilityUtils.setFacilityDto(rearDto, facility.getFacility().getName());
            }
        }
        return new SeatResponseDto(frontDto, rearDto, seatList);
    }
}
