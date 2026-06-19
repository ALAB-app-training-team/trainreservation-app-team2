package com.alab.shinkansendego.features.schedule.servicies;

import com.alab.shinkansendego.features.schedule.dtos.TrainCarFormationResponseDto;
import com.alab.shinkansendego.features.schedule.repositories.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainCarFormationService {
    private final ScheduleRepository scheduleRepository;

    @Autowired
    public TrainCarFormationService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public List<TrainCarFormationResponseDto> getTrainCarList(String scheduledCd) {
        List<TrainCarFormationResponseDto> trainCarList = scheduleRepository.findTrainCarFormationByScheduleCd(scheduledCd);

        if (trainCarList.isEmpty()) {
            throw new IllegalArgumentException("ScheduleCd is Not found");
        }
        return trainCarList;
    }
}
