package com.alab.shinkansendego.features.schedule.servicies;

import com.alab.shinkansendego.features.schedule.dtos.SeatResponseDto;
import com.alab.shinkansendego.features.schedule.repositories.TrainCarFormationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {
    private final TrainCarFormationRepository trainCarFormationRepository;

    @Autowired
    public SeatService(
            TrainCarFormationRepository trainCarFormationRepository) {
        this.trainCarFormationRepository = trainCarFormationRepository;
    }

    public List<SeatResponseDto> getSeatListByTrainCar(String request) {
        List<SeatResponseDto> seatList = trainCarFormationRepository.findSeatByTrainCarCd(request);

        if (seatList.isEmpty()) {
            throw new IllegalArgumentException("TrainCarCd is Not found");
        }

        return seatList;
    }
}
