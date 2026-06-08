package com.shinkansendego.demo.features.schedule.servicies;

import com.shinkansendego.demo.features.schedule.dtos.DepartureArrivalTimeDto;
import com.shinkansendego.demo.features.schedule.dtos.ScheduleRequestDto;
import com.shinkansendego.demo.features.schedule.dtos.ScheduleResponseDto;
import com.shinkansendego.demo.features.schedule.repositories.DepartureArrivalTimeRepository;
import com.shinkansendego.demo.features.schedule.repositories.ScheduleRepository;
import com.shinkansendego.demo.features.schedule.repositories.SectionKmRepository;
import com.shinkansendego.demo.features.schedule.repositories.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ScheduleService {
    private final StationRepository stationRepository;
    private final SectionKmRepository sectionKmRepository;
    private final DepartureArrivalTimeRepository departureArrivalTimeRepository;
    private final ScheduleRepository scheduleRepository;

    @Autowired
    public ScheduleService(
            StationRepository stationRepository, SectionKmRepository sectionKmRepository,
            DepartureArrivalTimeRepository departureArrivalTimeRepository, ScheduleRepository scheduleRepository) {
        this.stationRepository = stationRepository;
        this.sectionKmRepository = sectionKmRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<ScheduleResponseDto> getSearchedScheduleByStation(ScheduleRequestDto request) {

        List<ScheduleResponseDto> responseList = new ArrayList<>();

        String departureStationCd = stationRepository.findStationCdByName(request.getDeparture_station_name());
        String arrivalStationCd = stationRepository.findStationCdByName(request.getArrival_station_name());

        if (departureStationCd == null || arrivalStationCd == null) {
            throw new IllegalArgumentException("StationCD is Not found");
        }

        List<String> departureSectionCdList = sectionKmRepository.findSectionCdByStartStationCd(departureStationCd);
        List<String> arrivalSectionCdList = sectionKmRepository.findSectionCdByGoalStationCd(arrivalStationCd);

        if (departureSectionCdList.isEmpty() || arrivalSectionCdList.isEmpty()) {
            throw new IllegalArgumentException("SectionCD is Not found");
        }

        List<DepartureArrivalTimeDto> departureScheduleList = new ArrayList<>();
        List<DepartureArrivalTimeDto> arrivalScheduleList = new ArrayList<>();

        for (String cd : departureSectionCdList) {
            List<DepartureArrivalTimeDto> list = departureArrivalTimeRepository.findScheduleBySectionKmCd(cd);
            List<DepartureArrivalTimeDto> filteredList = list.stream().filter(
                    d -> !d.getDeparture_time().isBefore(request.getTime())).toList();
            departureScheduleList.addAll(filteredList);
        }
        for (String cd : arrivalSectionCdList) {
            List<DepartureArrivalTimeDto> list = departureArrivalTimeRepository.findScheduleBySectionKmCd(cd);
            arrivalScheduleList.addAll(list);
        }
        for (DepartureArrivalTimeDto departure : departureScheduleList) {
            for (DepartureArrivalTimeDto arrival : arrivalScheduleList) {
                if (Objects.equals(departure.getSchedule_cd(), arrival.getSchedule_cd())) {

                    String trainTypeName = scheduleRepository.findTrainTypeNameByScheduleCd(departure.getSchedule_cd());
                    if (trainTypeName == null) {
                        throw new IllegalArgumentException("TrainTypeName is Not found");
                    }

                    ScheduleResponseDto data = new ScheduleResponseDto();
                    data.setTrain_type_name(trainTypeName);
                    data.setDeparture_time(departure.getDeparture_time());
                    data.setArrival_time(arrival.getArrival_time());
                    responseList.add(data);
                }
            }
        }

        return responseList;

    }

}
