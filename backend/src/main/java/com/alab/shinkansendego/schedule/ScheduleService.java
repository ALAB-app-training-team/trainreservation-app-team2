package com.alab.shinkansendego.schedule;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeDto;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class ScheduleService {
    private final SectionKmRepository sectionKmRepository;
    private final DepartureArrivalTimeRepository departureArrivalTimeRepository;
    private final ScheduleRepository scheduleRepository;

    @Autowired
    public ScheduleService(SectionKmRepository sectionKmRepository, DepartureArrivalTimeRepository departureArrivalTimeRepository, ScheduleRepository scheduleRepository) {
        this.sectionKmRepository = sectionKmRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<ScheduleResponseDto> getSearchedScheduleByStation(ScheduleRequestDto request) {

        List<ScheduleResponseDto> responseList = new ArrayList<>();

        List<String> departureSectionCdList = sectionKmRepository.findSectionCdByStartStationCd(request.getDeparture_station_cd());
        List<String> arrivalSectionCdList = sectionKmRepository.findSectionCdByGoalStationCd(request.getArrival_station_cd());

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
                if (Objects.equals(departure.getSchedule_cd(), arrival.getSchedule_cd()) && departure.getDeparture_time().isBefore(arrival.getArrival_time())) {

                    String trainTypeName = scheduleRepository.findTrainTypeNameByScheduleCd(departure.getSchedule_cd());
                    if (trainTypeName == null) {
                        throw new IllegalArgumentException("TrainTypeName is Not found");
                    }

                    ScheduleResponseDto data = new ScheduleResponseDto();
                    data.setSchedule_cd(departure.getSchedule_cd());
                    data.setTrain_type_name(trainTypeName);
                    data.setDeparture_time(departure.getDeparture_time());
                    data.setArrival_time(arrival.getArrival_time());
                    responseList.add(data);
                }
            }
        }

        responseList.sort(Comparator.comparing(ScheduleResponseDto::getDeparture_time));

        return responseList;

    }

    public List<TrainCarFormationResponseDto> getTrainCarList(String scheduledCd) {
        List<TrainCarFormationResponseDto> trainCarList = scheduleRepository.findTrainCarFormationByScheduleCd(scheduledCd);

        if (trainCarList.isEmpty()) {
            throw new IllegalArgumentException("ScheduleCd is Not found");
        }
        return trainCarList;
    }

}
