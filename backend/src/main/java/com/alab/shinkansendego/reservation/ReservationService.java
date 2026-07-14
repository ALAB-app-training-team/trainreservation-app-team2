package com.alab.shinkansendego.reservation;

import ch.qos.logback.core.util.StringUtil;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;
import com.alab.shinkansendego.reservedseat.ReservedSeatRepository;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import java.util.Comparator;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ReservationService {

    private final RestClient restClient;
    private final ReservationRepository reservationRepository;
    private final ReservedSeatRepository reservedSeatRepository;
    private final SectionKmRepository sectionKmRepository;
    private final DepartureArrivalTimeRepository departureArrivalTimeRepository;
    private final ReservedSeatSectionRepository reservedSeatSectionRepository;

    @Autowired
    public ReservationService(
            ReservationRepository reservationRepository,
            ReservedSeatRepository reservedSeatRepository,
            SectionKmRepository sectionKmRepository,
            DepartureArrivalTimeRepository departureArrivalTimeRepository,
            ReservedSeatSectionRepository reservedSeatSectionRepository,
            RestClient.Builder restClientBuilder
    ) {
        this.reservationRepository = reservationRepository;
        this.reservedSeatRepository = reservedSeatRepository;
        this.sectionKmRepository = sectionKmRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.reservedSeatSectionRepository = reservedSeatSectionRepository;
        this.restClient = restClientBuilder.build();
    }

    /**
     * 予約時に登録した氏名とメールアドレスをもとに、紐づく予約情報一覧を取得するメソッド
     *
     * @param name  予約者氏名
     * @param email 予約者メールアドレス
     * @return 氏名とメールアドレスに紐づくReservationResponseDto(複数件)
     */
    public List<ReservationResponseDto> getReservationList(String name, String email) {
        List<ReservationResponseDto> reservationList = new ArrayList<>();
        List<ReservationEntity> reservationEntityList = reservationRepository.findByReserverNameAndReserverMail(this.removeSpaces(name), this.removeSpaces(email));
        if (reservationEntityList.isEmpty()) {
            return reservationList;
        }

        List<UUID> reservationIdList = reservationEntityList.stream()
                .map(ReservationEntity::getId)
                .toList();
        Map<UUID, List<ReservedSeatEntity>> reservedSeatEntityMap = reservedSeatRepository.findByReservationIdIn(reservationIdList)
                .stream().collect(Collectors.groupingBy(ReservedSeatEntity::getReservationId));

        for (ReservationEntity reservation : reservationEntityList) {
            ReservationResponseDto dto = new ReservationResponseDto();

            List<DepartureArrivalTimeEntity> scheduleList = reservation.getDepartureArrivalTime();

            DepartureArrivalTimeEntity departureSchedule = scheduleList.stream().filter(
                            schedule -> Objects.equals(
                                    schedule.getSectionKm().getStartStationCd(),
                                    reservation.getDepartureStationCd())
                    )
                    .min(Comparator.comparing(DepartureArrivalTimeEntity::getDepartureTime))
                    .orElseThrow(() -> new IllegalStateException("DepartureSchedule is NOT found"));

            DepartureArrivalTimeEntity arrivalSchedule = scheduleList.stream().filter(
                            schedule -> Objects.equals(
                                    schedule.getSectionKm().getGoalStationCd(),
                                    reservation.getArrivalStationCd())
                    )
                    .min(Comparator.comparing(DepartureArrivalTimeEntity::getDepartureTime))
                    .orElseThrow(() -> new IllegalStateException("ArrivalSchedule is NOT found"));


            List<ReservedSeatDto> reservedSeatDtos = reservedSeatEntityMap
                    .getOrDefault(reservation.getId(), new ArrayList<>()).stream()
                    .map(seat -> new ReservedSeatDto(
                            seat.getTrainCar().getSeatType().getTrainCarType().getName(),
                            seat.getTrainCar().getTrainCarNumber(),
                            seat.getSeat().getSeatNumber(),
                            seat.getSeat().getSeatColumn(),
                            seat.getCodeToken()))
                    .toList();

            dto.setPurchaseId(reservation.getId());
            dto.setTrainTypeName(reservation.getSchedule().getTrainType().getName());
            dto.setDepartureStationName(departureSchedule.getSectionKm().getStartStation().getName());
            dto.setDepartureTime(departureSchedule.getDepartureTime());
            dto.setArrivalStationName(arrivalSchedule.getSectionKm().getGoalStation().getName());
            dto.setArrivalTime(arrivalSchedule.getArrivalTime());
            dto.setRideDate(reservation.getRideDate());
            dto.setReservedSeats(reservedSeatDtos);

            reservationList.add(dto);
        }

        return reservationList;
    }

    /**
     * 特定の予約IDと予約者名、予約メールアドレスを入力としてIDに紐づく予約情報を1件取得するメソッド
     *
     * @param reservationId 情報を取ってきたい予約ID(1件)
     * @return 予約情報の入ったReservationResponseDto(1件)
     */
    public ReservationResponseDto getReservation(UUID reservationId, String name, String email) {

        ReservationResponseDto response = new ReservationResponseDto();

        ReservationDto purchase = reservationRepository.findReservationDtoByReservationIdAndReserverNameAndReserverMail(reservationId, this.removeSpaces(name), this.removeSpaces(email));
        if (purchase == null) {
            throw new IllegalArgumentException("PurchaseId is Not found");
        }

        List<ReservedScheduleDto> scheduleList = reservationRepository.findReservationScheduleDtoByReservationId(reservationId);
        List<ReservedScheduleDto> departureSchedule = scheduleList.stream().filter(schedule -> Objects.equals(schedule.getDepartureStationCd(), purchase.getDepartureStationCd())).toList();
        List<ReservedScheduleDto> arrivalSchedule = scheduleList.stream().filter(schedule -> Objects.equals(schedule.getArrivalStationCd(), purchase.getArrivalStationCd())).toList();
        if (departureSchedule.size() != 1 || arrivalSchedule.size() != 1) {
            throw new IllegalArgumentException("DepartureAndArrivalStation is Not Found");
        }

        List<ReservedSeatDto> reservedSeatList = reservedSeatRepository.findReservedSeatDtoByReservationId(reservationId);

        response.setTrainTypeName(purchase.getTrainTypeName());
        response.setDepartureStationName(departureSchedule.getFirst().getDepartureStationName());
        response.setDepartureTime(departureSchedule.getFirst().getDepartureTime());
        response.setArrivalStationName(arrivalSchedule.getFirst().getArrivalStationName());
        response.setArrivalTime(arrivalSchedule.getFirst().getArrivalTime());
        response.setRideDate(purchase.getRideDate());
        response.setReservedSeats(reservedSeatList);

        return response;
    }

    @Transactional
    public UUID insertReservation(ReserveRequestDto reserveRequestDto) {
        if (reserveRequestDto.getSeats() == null || reserveRequestDto.getSeats().isEmpty()) {
            throw new IllegalArgumentException("Seats is Not found");
        }

        if (reserveRequestDto.getSeats().size() > 6) {
            throw new IllegalArgumentException("Seat limit exceeded");
        }

        List<String> SectionKmCdsByDepartureStation = sectionKmRepository.findSectionCdByStartStationCd(reserveRequestDto.getDepartureStationCd());
        List<String> SectionKmCdsByArrivalStation = sectionKmRepository.findSectionCdByGoalStationCd(reserveRequestDto.getArrivalStationCd());

        DepartureArrivalTimeEntity departureArrivalTimeOfStart = departureArrivalTimeRepository.findByScheduleCdAndSectionCdIn(reserveRequestDto.getScheduleCd(), SectionKmCdsByDepartureStation);
        DepartureArrivalTimeEntity departureArrivalTimeOfGoal = departureArrivalTimeRepository.findByScheduleCdAndSectionCdIn(reserveRequestDto.getScheduleCd(), SectionKmCdsByArrivalStation);
        if (departureArrivalTimeOfStart == null || departureArrivalTimeOfGoal == null) {
            throw new IllegalArgumentException("Section is Not found");
        }

        List<String> sectionCdList =
                departureArrivalTimeRepository.findByScheduleCdAndDepartureTimeAndArrivalTime(reserveRequestDto.getScheduleCd(), departureArrivalTimeOfStart.getDepartureTime(), departureArrivalTimeOfGoal.getArrivalTime());
        if (sectionCdList.isEmpty()) {
            throw new IllegalArgumentException("SectionCd is Not found");
        }

        String paymentTrackingId = "";
        UUID reservationId = UUID.randomUUID();
        ReservationEntity reservationToPost = new ReservationEntity();
        reservationToPost.setId(reservationId);
        reservationToPost.setRideDate(reserveRequestDto.getRideDate());
        reservationToPost.setScheduleCd(reserveRequestDto.getScheduleCd());
        reservationToPost.setDepartureStationCd(reserveRequestDto.getDepartureStationCd());
        reservationToPost.setArrivalStationCd(reserveRequestDto.getArrivalStationCd());
        reservationToPost.setReserverName(this.removeSpaces(reserveRequestDto.getReserverName()));
        reservationToPost.setReserverMail(this.removeSpaces(reserveRequestDto.getReserverMail()));
        reservationToPost.setPaymentTrackingId(paymentTrackingId);

        ReservationEntity reservationResult = reservationRepository.save(reservationToPost);
        if (reservationResult.getId() == null) {
            throw new RuntimeException("Insert Purchase is failed");
        }

        List<ReservedSeatEntity> reservedSeatsToPost = new ArrayList<>();
        for (ReserveRequestDto.SelectedSeatDto seatDto : reserveRequestDto.getSeats()) {
            ReservedSeatEntity reservedSeat = new ReservedSeatEntity();
            reservedSeat.setId(UUID.randomUUID());
            reservedSeat.setReservationId(reservationResult.getId());
            reservedSeat.setTrainCarCd(seatDto.getTrainCarCd());
            reservedSeat.setSeatCd(seatDto.getSeatCd());
            reservedSeat.setCodeToken(UUID.randomUUID());
            reservedSeatsToPost.add(reservedSeat);
        }
        int reservedSeatResult = reservedSeatRepository.saveAll(reservedSeatsToPost).size();
        if (reservedSeatResult != reserveRequestDto.getSeats().size()) {
            throw new RuntimeException("Insert PurchasedSeats is failed");
        }

        List<ReservedSeatSectionEntity> reservedSeatSectionsToPost = new ArrayList<>();
        for (ReserveRequestDto.SelectedSeatDto seatDto : reserveRequestDto.getSeats()) {
            for (String sectionCd : sectionCdList) {
                ReservedSeatSectionEntity reservedSeatSection = new ReservedSeatSectionEntity(
                        UUID.randomUUID(), reservationId, reserveRequestDto.getRideDate(), reserveRequestDto.getScheduleCd(),
                        seatDto.getTrainCarCd(),
                        seatDto.getSeatCd(), sectionCd
                );
                reservedSeatSectionsToPost.add(reservedSeatSection);
            }
        }
        int reservedSeatSectionResult = reservedSeatSectionRepository.saveAll(reservedSeatSectionsToPost).size();
        if (reservedSeatSectionResult != sectionCdList.size() * reserveRequestDto.getSeats().size()) {
            throw new RuntimeException("Insert ReservedSeatSections is failed");
        }

        String paymentUrl = "http://localhost:8080/api/payments";
        paymentTrackingId = restClient.post()
                .uri(paymentUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(reserveRequestDto.getPaymentToken())
                .retrieve()
                .body(String.class);
        if (StringUtil.isNullOrEmpty(paymentTrackingId)) {
            throw new RuntimeException("Get PaymentTrackingId is failed");
        }

        reservationResult.setPaymentTrackingId(paymentTrackingId);
        reservationRepository.save(reservationResult);

        return reservationId;
    }

    /**
     * 文字列から全角半角の空白をすべて除く
     *
     * @param value 対象の文字列
     * @return 空白がすべて除かれた対象文字列
     */
    private static String removeSpaces(String value) {
        return value == null ? null : value.replaceAll("[\\s\u3000]", "");
    }
}
