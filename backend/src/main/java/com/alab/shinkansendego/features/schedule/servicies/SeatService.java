package com.alab.shinkansendego.features.schedule.servicies;

import com.alab.shinkansendego.features.schedule.dtos.SeatResponseDto;
import com.alab.shinkansendego.features.schedule.repositories.TrainCarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {
    private final TrainCarRepository trainCarRepository;

    @Autowired
    public SeatService(
            TrainCarRepository trainCarRepository) {
        this.trainCarRepository = trainCarRepository;
    }

    public List<SeatResponseDto> getSeatListByTrainCar(String request) {
        return trainCarRepository.findSeatByTrainCarCd(request);
    }
}
