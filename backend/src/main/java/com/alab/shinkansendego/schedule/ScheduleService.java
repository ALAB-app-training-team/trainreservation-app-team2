package com.alab.shinkansendego.schedule;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import com.alab.shinkansendego.totalseat.TotalSeatEntity;
import com.alab.shinkansendego.totalseat.TotalSeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
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

    @Autowired
    public ScheduleService(SectionKmRepository sectionKmRepository,
                           DepartureArrivalTimeRepository departureArrivalTimeRepository,
                           ScheduleRepository scheduleRepository,
                           ReservedSeatSectionRepository reservedSeatSectionRepository,
                           TotalSeatRepository totalSeatRepository) {
        this.sectionKmRepository = sectionKmRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.scheduleRepository = scheduleRepository;
        this.reservedSeatSectionRepository = reservedSeatSectionRepository;
        this.totalSeatRepository = totalSeatRepository;
    }

    public List<ScheduleResponseDto> getSearchedScheduleByStation(ScheduleRequestDto request) {

        List<ScheduleResponseDto> responseList = new ArrayList<>();

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
                        .stream().map(entity -> entity.getSectionCd()).toList();
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

                    SectionKmEntity sectionKm = departureSectionKmList.stream()
                        .filter(departureSectionKm -> Objects.equals(departureSectionKm.getSectionCd(), arrival.getSectionCd()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("sectionKm is failed"));
                    String direction = sectionKm.getDirection();

                    ScheduleResponseDto data = new ScheduleResponseDto();
                    data.setScheduleCd(departure.getScheduleCd());
                    data.setTrainTypeName(scheduleEntity.get().getTrainType().getName());
                    data.setDepartureTime(departure.getDepartureTime());
                    data.setArrivalTime(arrival.getArrivalTime());
                    data.setReservedSeats(calcReservedSeats);
                    data.setGreenSeats(calcGreenSeats);
                    data.setGcSeats(calcGcSeats);
                    data.setDirection(direction);
                    responseList.add(data);
                }
            }
        }

        responseList.sort(Comparator.comparing(ScheduleResponseDto::getDepartureTime));

        return responseList;
    }

    public List<TrainCarFormationResponseDto> getTrainCarList(String scheduledCd) {
        ScheduleEntity schedule = scheduleRepository.findByScheduleCd(scheduledCd).orElseThrow(() -> new IllegalArgumentException("Schedule is not found"));

        List<TrainCarFormationResponseDto> trainCarList = schedule.getTrainType().getTrainSeries().getTrainCars().stream()
            .sorted(Comparator.comparing(tc -> tc.getTrainCarNumber()))
            .map(tc -> new TrainCarFormationResponseDto(
                tc.getTrainCarCd(),
                tc.getTrainCarNumber(),
                tc.getSeatType().getSeatTypeCd(),
                tc.getSeatType().getTrainCarType().getName()
            )).collect(Collectors.toList());
        return trainCarList;
    }
}
