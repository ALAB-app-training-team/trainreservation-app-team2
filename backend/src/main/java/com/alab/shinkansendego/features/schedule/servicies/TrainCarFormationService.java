package com.alab.shinkansendego.features.schedule.servicies;

import com.alab.shinkansendego.features.schedule.dtos.TrainCarFormationResponseDto;
import com.alab.shinkansendego.features.schedule.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainCarFormationService {
    private final TrainCarFormationRepository trainCarFormationRepository;

    @Autowired
    public TrainCarFormationService(TrainCarFormationRepository trainCarFormationRepository) {
        this.trainCarFormationRepository = trainCarFormationRepository;
    }

    public List<TrainCarFormationResponseDto> getTrainCarList(String scheduledCd) {
        return trainCarFormationRepository.findTrainCarFormationByScheduleCd(scheduledCd);
    }
}
