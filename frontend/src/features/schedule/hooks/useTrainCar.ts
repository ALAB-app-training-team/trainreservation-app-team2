import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TrainCarFormationResponseDto } from "../types/TrainCarFormationResponseDto";
import { ENDPOINTS } from "../../../api/routes";
import { useMemo, useState } from "react";
import type { SeatsRequestDto } from "../types/SeatsRequestDto";
import type { ScheduleInfoDto } from "../types/ScheduleInfoDto";
import type { SeatTypeCd } from "../constants/seatType";
import { DEFAULT_SEAT_TYPE } from "../constants/seatType";

export function useTrainCar(scheduleInfoDto: ScheduleInfoDto){
  const { data: trainCarsData } = useSuspenseQuery({
    queryKey: ["ScheduleCd", scheduleInfoDto.schedule_cd],
    queryFn: async () => {
      const response = await axios.get<TrainCarFormationResponseDto[]>(
        ENDPOINTS.TRAINCAR(),
        {
          params: {schedule_cd: scheduleInfoDto.schedule_cd}
        },
      );
      return response.data;
    }
  });

  const [activeSeatTypeCd, setActiveSeatTypeCd] = useState<SeatTypeCd>(DEFAULT_SEAT_TYPE);

  const filteredCars = useMemo(() => {
    if (!trainCarsData) return [];
    return trainCarsData.filter((car) => car.seat_type_cd === activeSeatTypeCd);
  }, [trainCarsData, activeSeatTypeCd]);

  const [selectedTrainCarCd, setSelectedTrainCarCd] = useState<string>("");

  const activeTrainCarCd = useMemo(() => {
    const isCarInCurrentTab = filteredCars.some(
      (car) => car.train_car_cd === selectedTrainCarCd,
    );

    if (selectedTrainCarCd && isCarInCurrentTab) {
      return selectedTrainCarCd;
    }
    if (filteredCars && filteredCars.length > 0) {
      return filteredCars[0].train_car_cd;
    }
    return trainCarsData && trainCarsData.length > 0
      ? trainCarsData[0].train_car_cd
      : "";
  }, [selectedTrainCarCd, filteredCars, trainCarsData]);

  const handleSeatTypeChange = (code: SeatTypeCd) => {
    setActiveSeatTypeCd(code);
  };

  const seatsRequestDto: SeatsRequestDto = useMemo(() => ({
    schedule_cd: scheduleInfoDto.schedule_cd,
    date: scheduleInfoDto.date,
    departure_time: scheduleInfoDto.departure_time,
    arrival_time: scheduleInfoDto.arrival_time,
    train_car_cd: activeTrainCarCd,
  }), [scheduleInfoDto, activeTrainCarCd]);

  return {
    trainCarsData,
    activeSeatTypeCd,
    filteredCars,
    activeTrainCarCd,
    handleSeatTypeChange,
    setSelectedTrainCarCd,
    seatsRequestDto
  };
}
