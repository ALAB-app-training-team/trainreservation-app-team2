package com.alab.shinkansendego.schedule;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.farekm.FareKmService;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import com.alab.shinkansendego.totalseat.TotalSeatEntity;
import com.alab.shinkansendego.totalseat.TotalSeatRepository;
import com.alab.shinkansendego.traincar.TrainCarEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduleService {
    private final SectionKmRepository sectionKmRepository;
    private final DepartureArrivalTimeRepository departureArrivalTimeRepository;
    private final ScheduleRepository scheduleRepository;
    private final ReservedSeatSectionRepository reservedSeatSectionRepository;
    private final TotalSeatRepository totalSeatRepository;
    private final FareKmService fareKmService;

    @Autowired
    public ScheduleService(SectionKmRepository sectionKmRepository,
                           DepartureArrivalTimeRepository departureArrivalTimeRepository,
                           ScheduleRepository scheduleRepository,
                           ReservedSeatSectionRepository reservedSeatSectionRepository,
                           TotalSeatRepository totalSeatRepository,
                           FareKmService fareKmService) {
        this.sectionKmRepository = sectionKmRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.scheduleRepository = scheduleRepository;
        this.reservedSeatSectionRepository = reservedSeatSectionRepository;
        this.totalSeatRepository = totalSeatRepository;
        this.fareKmService = fareKmService;
    }

    /**
     * 検索画面の入力内容に該当するスケジュールリストを返す
     *
     * @param request 検索画面で入力した条件
     * @return 各席種の料金とスケジュールリスト
     */
    public ScheduleResponseDto getSearchedScheduleByStation(ScheduleRequestDto request) {

        List<ScheduleDto> responseList = new ArrayList<>();

        List<SectionKmEntity> departureSectionKmList = sectionKmRepository.findByStartStationCd(request.getDepartureStationCd());
        List<SectionKmEntity> arrivalSectionKmList = sectionKmRepository.findByGoalStationCd(request.getArrivalStationCd());

        if (departureSectionKmList.isEmpty() || arrivalSectionKmList.isEmpty()) {
            throw new IllegalArgumentException("Section is Not found");
        }

        List<DepartureArrivalTimeEntity> departureScheduleList = new ArrayList<>();
        List<DepartureArrivalTimeEntity> arrivalScheduleList = new ArrayList<>();

        for (SectionKmEntity departureSectionKm : departureSectionKmList) {
            List<DepartureArrivalTimeEntity> list = departureArrivalTimeRepository.findBySectionCd(departureSectionKm.getSectionCd());
            departureScheduleList.addAll(list);
        }
        for (SectionKmEntity arrivalSectionKm : arrivalSectionKmList) {
            List<DepartureArrivalTimeEntity> list = departureArrivalTimeRepository.findBySectionCd(arrivalSectionKm.getSectionCd());
            arrivalScheduleList.addAll(list);
        }

        List<TotalSeatEntity> totalSeatEntities = totalSeatRepository.findAll();

        for (DepartureArrivalTimeEntity departure : departureScheduleList) {
            for (DepartureArrivalTimeEntity arrival : arrivalScheduleList) {
                if (Objects.equals(departure.getScheduleCd(), arrival.getScheduleCd()) &&
                    departure.getDepartureTime().isBefore(arrival.getArrivalTime())) {

                    Optional<ScheduleEntity> scheduleEntity = scheduleRepository.findById(departure.getScheduleCd());

                    if (scheduleEntity.isPresent()) {
                        if (scheduleEntity.get().getTrainType().getName() == null ||
                            scheduleEntity.get().getTrainType().getTrainSeriesCd() == null) {
                            throw new IllegalArgumentException("TrainType is Not found");
                        }
                    } else {
                        throw new IllegalArgumentException("OptionalSchedule is Not found");
                    }

                    List<String> sectionCdList = departureArrivalTimeRepository.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(
                            departure.getScheduleCd(), departure.getDepartureTime(), arrival.getArrivalTime())
                        .stream().map(DepartureArrivalTimeEntity::getSectionCd).toList();
                    List<ReservedSeatSectionEntity> reservedSeatSectionEntities
                        = reservedSeatSectionRepository
                        .findByRideDateAndScheduleCdAndReservedSectionCdIn(
                            request.getDate(),
                            departure.getScheduleCd(),
                            sectionCdList
                        );

                    TotalSeatEntity totalSeats = totalSeatEntities.stream()
                        .filter(entity -> (Objects.equals(entity.getTrainSeriesCd(), scheduleEntity.get().getTrainType().getTrainSeriesCd())))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("TotalSeat Of TrainSeriesCd is Not Found"));
                    int calcReservedSeats = totalSeats.getReservedTotal() - (reservedSeatSectionEntities
                        .stream().filter(entity -> (Objects.equals(entity.getTrainCarTypeCd(), "CAR01")))
                        .collect(Collectors.groupingBy(ReservedSeatSectionEntity::getSeatCd)).size());
                    int calcGreenSeats = totalSeats.getGreenTotal() - (reservedSeatSectionEntities
                        .stream().filter(entity -> (Objects.equals(entity.getTrainCarTypeCd(), "CAR02")))
                        .collect(Collectors.groupingBy(ReservedSeatSectionEntity::getSeatCd)).size());
                    int calcGcSeats = totalSeats.getGcTotal() - (reservedSeatSectionEntities
                        .stream().filter(entity -> (Objects.equals(entity.getTrainCarTypeCd(), "CAR03")))
                        .collect(Collectors.groupingBy(ReservedSeatSectionEntity::getSeatCd)).size());

                    if (calcReservedSeats < 0 || calcGreenSeats < 0 || calcGcSeats < 0) {
                        throw new IllegalArgumentException("AvailableSeats is Not found");
                    }

                    SectionKmEntity sectionKm = arrivalSectionKmList.stream()
                        .filter(arrivalSectionKm -> Objects.equals(arrivalSectionKm.getSectionCd(), arrival.getSectionCd()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("SectionKm is Not found"));

                    ScheduleDto data = new ScheduleDto();
                    data.setScheduleCd(departure.getScheduleCd());
                    data.setTrainTypeName(scheduleEntity.get().getTrainType().getName());
                    data.setDepartureTime(departure.getDepartureTime());
                    data.setArrivalTime(arrival.getArrivalTime());
                    data.setReservedSeats(calcReservedSeats);
                    data.setGreenSeats(calcGreenSeats);
                    data.setGcSeats(calcGcSeats);
                    data.setDirection(sectionKm.getDirection());
                    responseList.add(data);
                }
            }
        }
        responseList.sort(Comparator.comparing(ScheduleDto::getDepartureTime));

        Integer reservedFare = null;
        Integer greenFare = null;
        Integer gcFare = null;
        if (!responseList.isEmpty()) {
            ScheduleDto representative = responseList.getFirst();
            List<String> sectionCdList =
                departureArrivalTimeRepository.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(
                        representative.getScheduleCd(), representative.getDepartureTime(), representative.getArrivalTime())
                    .stream().map(DepartureArrivalTimeEntity::getSectionCd).toList();
            if (sectionCdList.isEmpty()) {
                throw new IllegalArgumentException("SectionCdOfSeat is Not found");
            }
            List<SectionKmEntity> sectionKmList = sectionKmRepository.findBySectionCdIn(sectionCdList);
            Double distanceKm = sectionKmList.stream().mapToDouble(SectionKmEntity::getDistanceKm).sum();
            Map<String, Integer> fares = fareKmService.getFareFromDistance(distanceKm);

            if (responseList.stream().mapToInt(ScheduleDto::getReservedSeats).sum() > 0) {
                reservedFare = fares.get("reserved");
            }
            if (responseList.stream().mapToInt(ScheduleDto::getGreenSeats).sum() > 0) {
                greenFare = fares.get("green");
            }
            if (responseList.stream().mapToInt(ScheduleDto::getGcSeats).sum() > 0) {
                gcFare = fares.get("gran-class");
            }
        }

        return new ScheduleResponseDto(reservedFare, greenFare, gcFare, responseList);
    }

    /**
     * スケジュールCDを受け取って号車情報尾を返す
     *
     * @param scheduledCd スケジュールCD
     * @return 列車の号車構成
     */
    public List<TrainCarFormationResponseDto> getTrainCarList(String scheduledCd) {
        ScheduleEntity schedule = scheduleRepository.findByScheduleCd(scheduledCd).orElseThrow(() -> new IllegalArgumentException("Schedule is not found"));

        return schedule.getTrainType().getTrainSeries().getTrainCars().stream()
            .sorted(Comparator.comparing(TrainCarEntity::getTrainCarNumber))
            .map(tc -> new TrainCarFormationResponseDto(
                tc.getTrainCarCd(),
                tc.getTrainCarNumber(),
                tc.getSeatType().getSeatTypeCd(),
                tc.getSeatType().getTrainCarType().getName()
            )).collect(Collectors.toList());
    }
}
