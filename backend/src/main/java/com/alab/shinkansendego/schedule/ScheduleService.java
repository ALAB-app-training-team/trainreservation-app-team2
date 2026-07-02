package com.alab.shinkansendego.schedule;

import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
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

        List<DepartureArrivalTimeEntity> departureScheduleList = new ArrayList<>();
        List<DepartureArrivalTimeEntity> arrivalScheduleList = new ArrayList<>();

        for (String cd : departureSectionCdList) {
            List<DepartureArrivalTimeEntity> list = departureArrivalTimeRepository.findBySectionCd(cd);
            List<DepartureArrivalTimeEntity> filteredList = list.stream().filter(
                    d -> !d.getDepartureTime().isBefore(request.getTime())).toList();
            departureScheduleList.addAll(filteredList);
        }
        for (String cd : arrivalSectionCdList) {
            List<DepartureArrivalTimeEntity> list = departureArrivalTimeRepository.findBySectionCd(cd);
            arrivalScheduleList.addAll(list);
        }
        for (DepartureArrivalTimeEntity departure : departureScheduleList) {
            for (DepartureArrivalTimeEntity arrival : arrivalScheduleList) {
                if (Objects.equals(departure.getScheduleCd(), arrival.getScheduleCd()) && departure.getDepartureTime().isBefore(arrival.getArrivalTime())) {

                    String trainTypeName = scheduleRepository.findTrainTypeNameByScheduleCd(departure.getScheduleCd());
                    if (trainTypeName == null) {
                        throw new IllegalArgumentException("TrainTypeName is Not found");
                    }

                    ScheduleResponseDto data = new ScheduleResponseDto();
                    data.setSchedule_cd(departure.getScheduleCd());
                    data.setTrain_type_name(trainTypeName);
                    data.setDeparture_time(departure.getDepartureTime());
                    data.setArrival_time(arrival.getArrivalTime());
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
