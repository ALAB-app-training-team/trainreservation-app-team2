package com.alab.shinkansendego.reservation;

import ch.qos.logback.core.util.StringUtil;
import com.alab.shinkansendego.account.AccountEntity;
import com.alab.shinkansendego.account.AccountRepository;
import com.alab.shinkansendego.account.AccountSessionDto;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeEntity;
import com.alab.shinkansendego.departurearrivaltime.DepartureArrivalTimeRepository;
import com.alab.shinkansendego.exception.ConflictException;
import com.alab.shinkansendego.reservedseat.ReservedSeatEntity;
import com.alab.shinkansendego.reservedseat.ReservedSeatRepository;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionEntity;
import com.alab.shinkansendego.reservedseatsection.ReservedSeatSectionRepository;
import com.alab.shinkansendego.seat.SeatEntity;
import com.alab.shinkansendego.seat.SeatRepository;
import com.alab.shinkansendego.sectionkm.SectionKmEntity;
import com.alab.shinkansendego.sectionkm.SectionKmRepository;
import com.alab.shinkansendego.traincar.SeatResponseDto;
import com.alab.shinkansendego.traincar.TrainCarEntity;
import com.alab.shinkansendego.traincar.TrainCarRepository;
import com.alab.shinkansendego.utils.StringUtils;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final RestClient restClient;
    private final EntityManager entityManager;
    private final ReservationRepository reservationRepository;
    private final ReservedSeatRepository reservedSeatRepository;
    private final SectionKmRepository sectionKmRepository;
    private final DepartureArrivalTimeRepository departureArrivalTimeRepository;
    private final ReservedSeatSectionRepository reservedSeatSectionRepository;
    private final TrainCarRepository trainCarRepository;
    private final SeatRepository seatRepository;
    private final AccountRepository accountRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Autowired
    public ReservationService(
        ReservationRepository reservationRepository,
        ReservedSeatRepository reservedSeatRepository,
        SectionKmRepository sectionKmRepository,
        DepartureArrivalTimeRepository departureArrivalTimeRepository,
        ReservedSeatSectionRepository reservedSeatSectionRepository,
        TrainCarRepository trainCarRepository,
        SeatRepository seatRepository,
        AccountRepository accountRepository,
        RestClient.Builder restClientBuilder,
        EntityManager entityManager,
        ApplicationEventPublisher eventPublisher
    ) {
        this.reservationRepository = reservationRepository;
        this.reservedSeatRepository = reservedSeatRepository;
        this.sectionKmRepository = sectionKmRepository;
        this.departureArrivalTimeRepository = departureArrivalTimeRepository;
        this.reservedSeatSectionRepository = reservedSeatSectionRepository;
        this.trainCarRepository = trainCarRepository;
        this.seatRepository = seatRepository;
        this.accountRepository = accountRepository;
        this.restClient = restClientBuilder.build();
        this.entityManager = entityManager;
        this.eventPublisher = eventPublisher;
    }

    /**
     * ログイン中のアカウント情報をもとに、紐づく予約情報一覧を取得するメソッド
     *
     * @return ログイン中のアカウント情報に紐づくReservationResponseDto(複数件)
     */
    public List<ReservationResponseDto> getReservationList(UUID accountId) {
        List<ReservationResponseDto> reservationList = new ArrayList<>();
        List<ReservationEntity> reservationEntityList = reservationRepository.findByAccountId(accountId);
        if (reservationEntityList.isEmpty()) {
            return reservationList;
        }

        Map<UUID, List<ReservedSeatEntity>> reservedSeatEntityMap = reservationEntityList
            .stream().map(ReservationEntity::getReservedSeat).flatMap(Set::stream)
            .collect(Collectors.groupingBy(ReservedSeatEntity::getReservationId));

        for (ReservationEntity reservation : reservationEntityList) {
            ReservationResponseDto dto = new ReservationResponseDto();

            Set<DepartureArrivalTimeEntity> scheduleList = reservation.getDepartureArrivalTime();

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
                    seat.getId(),
                    seat.getTrainCar().getSeatType().getTrainCarType().getName(),
                    seat.getTrainCar().getTrainCarNumber(),
                    seat.getSeat().getSeatNumber(),
                    seat.getSeat().getSeatColumn(),
                    seat.getCodeToken(),
                    seat.getSeatFare(),
                    seat.getName(),
                    seat.getMail()))
                .sorted(Comparator.comparing(ReservedSeatDto::getTrainCarNumber)
                    .thenComparing(ReservedSeatDto::getSeatNumber)
                    .thenComparing(ReservedSeatDto::getSeatColumn))
                .toList();

            dto.setReservationId(reservation.getId());
            dto.setScheduleCd(reservation.getScheduleCd());
            dto.setTrainTypeName(reservation.getSchedule().getTrainType().getName());
            dto.setDepartureStationCd(departureSchedule.getSectionKm().getStartStationCd());
            dto.setDepartureStationName(departureSchedule.getSectionKm().getStartStation().getName());
            dto.setDepartureTime(departureSchedule.getDepartureTime());
            dto.setArrivalStationCd(arrivalSchedule.getSectionKm().getGoalStationCd());
            dto.setArrivalStationName(arrivalSchedule.getSectionKm().getGoalStation().getName());
            dto.setArrivalTime(arrivalSchedule.getArrivalTime());
            dto.setRideDate(reservation.getRideDate());
            dto.setIsDeleted(reservation.getIsDeleted());
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
    public ReservationResponseDto getGuestReservation(UUID reservationId, String name, String email) {
        Optional<ReservationEntity> reservationEntity = reservationRepository.findById(reservationId);
        if (reservationEntity.isEmpty()) return null;

        if (Objects.equals(reservationEntity.get().getReserverName(), StringUtils.removeSpaces(name))
            && Objects.equals(reservationEntity.get().getReserverMail(), StringUtils.removeSpaces(email))) {
            if (reservationEntity.get().getAccountId() != null) return null;
        } else {
            boolean isCompanionMatched = reservationEntity.get().getReservedSeat().stream()
                .anyMatch(seat -> Objects.equals(seat.getName(), StringUtils.removeSpaces(name)) && Objects.equals(seat.getMail(), StringUtils.removeSpaces(email)));
            if (!isCompanionMatched) return null;
        }

        return createReservationResponseDto(reservationEntity);
    }

    /**
     * 特定の予約IDとアカウントIDを入力としてIDに紐づく予約情報を1件取得するメソッド
     *
     * @param reservationId 情報を取ってきたい予約ID(1件)
     * @param accountId     アカウントID
     * @return 予約情報の入ったReservationResponseDto(1件)
     */
    public ReservationResponseDto getAccountReservation(UUID reservationId, UUID accountId) {

        Optional<ReservationEntity> reservationEntity = reservationRepository
            .findWithEntityGraphByIdAndAccountId(reservationId, accountId);

        if (reservationEntity.isEmpty()) throw new IllegalArgumentException("ReservationId is Not found");
        return createReservationResponseDto(reservationEntity);
    }

    /**
     * 予約情報EntityからReservationResponseDtoを作成するメソッド
     *
     * @param reservationEntity 予約情報Entity
     * @return 登録した予約情報ID
     */
    @Transactional
    public ReservationResponseDto createReservationResponseDto(Optional<ReservationEntity> reservationEntity) {
        ReservationResponseDto dto = new ReservationResponseDto();
        List<ReservedScheduleDto> scheduleList = reservationEntity.get().getDepartureArrivalTime().stream().map(
                schedule ->
                    new ReservedScheduleDto(
                        schedule.getDepartureTime(),
                        schedule.getSectionKm().getStartStation().getStationCd(),
                        schedule.getSectionKm().getStartStation().getName(),
                        schedule.getArrivalTime(),
                        schedule.getSectionKm().getGoalStation().getStationCd(),
                        schedule.getSectionKm().getGoalStation().getName()
                    )
            )
            .toList();

        List<ReservedScheduleDto> departureSchedule =
            scheduleList.stream().filter(schedule -> Objects.equals(schedule.getDepartureStationCd(),
                reservationEntity.get().getDepartureStationCd())).toList();
        List<ReservedScheduleDto> arrivalSchedule =
            scheduleList.stream().filter(schedule -> Objects.equals(schedule.getArrivalStationCd(),
                reservationEntity.get().getArrivalStationCd())).toList();
        if (departureSchedule.size() != 1 || arrivalSchedule.size() != 1) {
            throw new IllegalArgumentException("DepartureAndArrivalStation is Not Found");
        }

        List<ReservedSeatEntity> reservedSeatEntityList = reservationEntity.stream().map(ReservationEntity::getReservedSeat).flatMap(Set::stream).toList();
        List<ReservedSeatDto> reservedSeatList = reservedSeatEntityList.stream()
            .map(seat -> new ReservedSeatDto(
                seat.getId(),
                seat.getTrainCar().getSeatType().getTrainCarType().getName(),
                seat.getTrainCar().getTrainCarNumber(),
                seat.getSeat().getSeatNumber(),
                seat.getSeat().getSeatColumn(),
                seat.getCodeToken(),
                seat.getSeatFare(),
                seat.getName(),
                seat.getMail()))
            .sorted(Comparator.comparing(ReservedSeatDto::getTrainCarNumber)
                .thenComparing(ReservedSeatDto::getSeatNumber)
                .thenComparing(ReservedSeatDto::getSeatColumn)).toList();

        dto.setReservationId(reservationEntity.get().getId());
        dto.setScheduleCd(reservationEntity.get().getScheduleCd());
        dto.setTrainTypeName(reservationEntity.get().getSchedule().getTrainType().getName());
        dto.setDepartureStationCd(departureSchedule.getFirst().getDepartureStationCd());
        dto.setDepartureStationName(departureSchedule.getFirst().getDepartureStationName());
        dto.setDepartureTime(departureSchedule.getFirst().getDepartureTime());
        dto.setArrivalStationCd(arrivalSchedule.getFirst().getArrivalStationCd());
        dto.setArrivalStationName(arrivalSchedule.getFirst().getArrivalStationName());
        dto.setArrivalTime(arrivalSchedule.getFirst().getArrivalTime());
        dto.setRideDate(reservationEntity.get().getRideDate());
        dto.setIsDeleted(reservationEntity.get().getIsDeleted());
        dto.setReservedSeats(reservedSeatList);

        return dto;
    }

    /**
     * 画面上で選択した予約内容を登録するメソッド
     *
     * @param reserveRequestDto 画面で選択した登録するべき予約情報
     * @return 登録した予約情報ID
     */
    @Transactional
    public UUID insertReservation(ReserveRequestDto reserveRequestDto, AccountSessionDto session) {
        AccountEntity account = null;
        if (session != null) {
            account = accountRepository.findById(session.getId()).orElseThrow(() -> new BadCredentialsException("認証に失敗しました"));
            reserveRequestDto.setReserverName(session.getName());
            reserveRequestDto.setReserverMail(session.getMail());
        } else if (reserveRequestDto.getReserverName().isBlank() || reserveRequestDto.getReserverMail().isBlank()) {
            throw new IllegalArgumentException("氏名とメールアドレスがありません");
        }

        if (reserveRequestDto.getSeats() == null || reserveRequestDto.getSeats().isEmpty()) {
            throw new IllegalArgumentException("Seats is Not found");
        }

        if (reserveRequestDto.getSeats().size() > 6) {
            throw new IllegalArgumentException("Seat limit exceeded");
        }

        List<String> sectionCdList = getSectionCdList(reserveRequestDto.getScheduleCd(), reserveRequestDto.getDepartureStationCd(), reserveRequestDto.getArrivalStationCd());

        String paymentTrackingId = "";
        UUID reservationId = UUID.randomUUID();
        ReservationEntity reservationToPost = new ReservationEntity();
        reservationToPost.setId(reservationId);
        reservationToPost.setRideDate(reserveRequestDto.getRideDate());
        reservationToPost.setScheduleCd(reserveRequestDto.getScheduleCd());
        reservationToPost.setDepartureStationCd(reserveRequestDto.getDepartureStationCd());
        reservationToPost.setArrivalStationCd(reserveRequestDto.getArrivalStationCd());
        reservationToPost.setReserverName(StringUtils.removeSpaces(reserveRequestDto.getReserverName()));
        reservationToPost.setReserverMail(StringUtils.removeSpaces(reserveRequestDto.getReserverMail()));
        reservationToPost.setPaymentTrackingId(paymentTrackingId);
        reservationToPost.setIsDeleted(false);
        if (session != null) reservationToPost.setAccountId(account.getId());

        ReservationEntity reservationResult = reservationRepository.save(reservationToPost);
        if (reservationResult.getId() == null) {
            throw new RuntimeException("Insert Reservation is failed");
        }

        insertReservedSeatAndReservedSeatSection(reservationResult.getId(), reserveRequestDto.getSeats(), sectionCdList, reserveRequestDto.getRideDate(), reserveRequestDto.getScheduleCd());

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

        DepartureArrivalTimeEntity departureArrivalTimeOfStart = departureArrivalTimeRepository
            .findByScheduleCdAndSectionCdIn(reserveRequestDto.getScheduleCd(), List.of(sectionCdList.get(0)));

        DepartureArrivalTimeEntity departureArrivalTimeOfGoal = departureArrivalTimeRepository
            .findByScheduleCdAndSectionCdIn(reserveRequestDto.getScheduleCd(), List.of(sectionCdList.get(sectionCdList.size() - 1)));

        reserveRequestDto.setReserverName(StringUtils.removeSpaces(reserveRequestDto.getReserverName()));
        reserveRequestDto.setReserverMail(StringUtils.removeSpaces(reserveRequestDto.getReserverMail()));

        eventPublisher.publishEvent(new ReservationCreatedEvent(
            reservationId,
            reserveRequestDto,
            departureArrivalTimeOfStart.getDepartureTime(),
            departureArrivalTimeOfGoal.getArrivalTime()
        ));

        return reservationId;
    }

    /**
     * 出発駅と到着駅から区間CDリストを取得するメソッド
     *
     * @param scheduleCd         ダイヤCd
     * @param departureStationCd 出発駅CD
     * @param arrivalStationCd   到着駅CD
     * @return 区間CDリスト
     */
    private List<String> getSectionCdList(String scheduleCd, String departureStationCd, String arrivalStationCd) {
        List<String> SectionKmCdsByDepartureStation = sectionKmRepository.findByStartStationCd(departureStationCd).stream().map(SectionKmEntity::getSectionCd).toList();
        List<String> SectionKmCdsByArrivalStation = sectionKmRepository.findByGoalStationCd(arrivalStationCd).stream().map(SectionKmEntity::getSectionCd).toList();

        DepartureArrivalTimeEntity departureArrivalTimeOfStart = departureArrivalTimeRepository.findByScheduleCdAndSectionCdIn(scheduleCd, SectionKmCdsByDepartureStation);
        DepartureArrivalTimeEntity departureArrivalTimeOfGoal = departureArrivalTimeRepository.findByScheduleCdAndSectionCdIn(scheduleCd, SectionKmCdsByArrivalStation);
        if (departureArrivalTimeOfStart == null || departureArrivalTimeOfGoal == null) {
            throw new IllegalArgumentException("Section is Not found");
        }

        List<String> sectionCdList = departureArrivalTimeRepository.findByScheduleCdAndDepartureTimeGreaterThanEqualAndArrivalTimeLessThanEqual(
                scheduleCd, departureArrivalTimeOfStart.getDepartureTime(), departureArrivalTimeOfGoal.getArrivalTime())
            .stream().map(DepartureArrivalTimeEntity::getSectionCd).toList();
        if (sectionCdList.isEmpty()) {
            throw new IllegalArgumentException("SectionCd is Not found");
        }
        return sectionCdList;
    }

    /**
     * 予約座席情報予約済座席区間を登録するメソッド
     *
     * @param reservationId 予約情報ID
     * @param seatDtos      登録する座席情報
     * @param sectionCdList 登録する区間情報
     * @param rideDate      登録する乗車日付
     * @param scheduleCd    登録するダイヤCD
     */
    private void insertReservedSeatAndReservedSeatSection(
        UUID reservationId,
        List<ReserveRequestDto.SelectedSeatDto> seatDtos,
        List<String> sectionCdList,
        LocalDate rideDate,
        String scheduleCd) {
        List<ReservedSeatEntity> reservedSeatsToPost = new ArrayList<>();
        for (ReserveRequestDto.SelectedSeatDto seatDto : seatDtos) {
            ReservedSeatEntity reservedSeat = new ReservedSeatEntity();
            reservedSeat.setId(UUID.randomUUID());
            reservedSeat.setReservationId(reservationId);
            reservedSeat.setTrainCarCd(seatDto.getTrainCarCd());
            reservedSeat.setSeatCd(seatDto.getSeatCd());
            reservedSeat.setCodeToken(UUID.randomUUID());
            reservedSeat.setSeatFare(seatDto.getSeatFare());
            reservedSeat.setIsDeleted(false);
            TrainCarEntity trainCar = trainCarRepository.findById(seatDto.getTrainCarCd()).orElseThrow(() -> new IllegalArgumentException("TrainCar is not found"));
            reservedSeat.setTrainCar(trainCar);
            SeatEntity seat = seatRepository.findById(seatDto.getSeatCd()).orElseThrow(() -> new IllegalArgumentException("Seat is not found"));
            reservedSeat.setSeat(seat);
            reservedSeatsToPost.add(reservedSeat);
        }
        List<ReservedSeatEntity> savedReservedSeats = reservedSeatRepository.saveAll(reservedSeatsToPost);
        int reservedSeatResult = savedReservedSeats.size();
        if (reservedSeatResult != seatDtos.size()) {
            throw new RuntimeException("Insert ReservedSeats is failed");
        }

        List<ReservedSeatSectionEntity> reservedSeatSectionsToPost = new ArrayList<>();
        for (ReserveRequestDto.SelectedSeatDto seatDto : seatDtos) {
            for (String sectionCd : sectionCdList) {
                ReservedSeatSectionEntity reservedSeatSection = new ReservedSeatSectionEntity(
                    UUID.randomUUID(), reservationId, rideDate, scheduleCd,
                    seatDto.getTrainCarCd(),
                    seatDto.getSeatCd(), sectionCd, seatDto.getTrainCarTypeCd()
                );
                reservedSeatSectionsToPost.add(reservedSeatSection);
            }
        }

        List<String> sectionCds = reservedSeatSectionsToPost.stream().map(ReservedSeatSectionEntity::getReservedSectionCd).distinct().toList();
        List<String> trainCarCds = reservedSeatsToPost.stream().map(ReservedSeatEntity::getTrainCarCd).distinct().toList();
        List<ReservedSeatSectionEntity> existingReservedSeatSections = reservedSeatSectionRepository.findByRideDateAndScheduleCdAndTrainCarCdInAndReservedSectionCdIn(
            reservedSeatSectionsToPost.getFirst().getRideDate(),
            reservedSeatSectionsToPost.getFirst().getScheduleCd(),
            trainCarCds,
            sectionCds);

        if (!existingReservedSeatSections.isEmpty()) {
            Set<String> existingKeys = existingReservedSeatSections.stream()
                .map(sec -> sec.getTrainCarCd() + "_" + sec.getSeatCd())
                .collect(Collectors.toSet());
            List<SeatResponseDto> seatResponseDtos = new ArrayList<>();

            for (ReservedSeatEntity reservedSeat : savedReservedSeats) {
                String key = reservedSeat.getTrainCarCd() + "_" + reservedSeat.getSeatCd();
                if (existingKeys.contains(key)) {
                    seatResponseDtos.add(new SeatResponseDto(reservedSeat.getTrainCarCd(), reservedSeat.getTrainCar().getTrainCarNumber(), reservedSeat.getTrainCar().getSeatType().getTrainCarTypeCd(), reservedSeat.getSeatCd(), reservedSeat.getSeat().getSeatNumber(), reservedSeat.getSeat().getSeatColumn(), 0, true));
                }
            }
            if (!seatResponseDtos.isEmpty()) {
                String conflictSeatJson = new ObjectMapper().writeValueAsString(seatResponseDtos);
                throw new ConflictException(conflictSeatJson);
            }
        }

        int reservedSeatSectionResult = reservedSeatSectionRepository.saveAll(reservedSeatSectionsToPost).size();
        if (reservedSeatSectionResult != sectionCdList.size() * seatDtos.size()) {
            throw new RuntimeException("Insert ReservedSeatSections is failed");
        }
    }

    /**
     * 日時・経路変更メソッド
     *
     * @param reservationId      画面で選択した登録するべき予約情報
     * @param changedReservation 画面で選択した変更するべき予約情報
     * @param session            ログイン情報
     * @return 登録した予約情報ID
     */
    @Transactional
    public UUID putReservation(UUID reservationId, ReserveRequestDto changedReservation, AccountSessionDto session) {
        Optional<ReservationEntity> reservation = putError(reservationId, changedReservation, session);

        Integer oldTotalAmount = reservation.get().getReservedSeat().stream()
            .filter(seat -> seat.getSeatFare() != null)
            .mapToInt(ReservedSeatEntity::getSeatFare)
            .sum();

        reservation.get().setRideDate(changedReservation.getRideDate());
        reservation.get().setScheduleCd(changedReservation.getScheduleCd());
        reservation.get().setDepartureStationCd(changedReservation.getDepartureStationCd());
        reservation.get().setArrivalStationCd(changedReservation.getArrivalStationCd());
        reservationRepository.save(reservation.get());

        entityManager.flush();
        entityManager.clear();

        Set<ReservedSeatEntity> reservedSeats = reservation.get().getReservedSeat();
        List<ReservedSeatSectionEntity> deleteSeatSections = reservedSeats.stream()
            .flatMap(seat -> seat.getReservedSeatSection().stream())
            .toList();
        reservedSeatRepository.deleteAll(reservedSeats);
        reservedSeatSectionRepository.deleteAll(deleteSeatSections);

        entityManager.flush();
        entityManager.clear();

        List<String> sectionCds = getSectionCdList(
            changedReservation.getScheduleCd(),
            changedReservation.getDepartureStationCd(),
            changedReservation.getArrivalStationCd());

        insertReservedSeatAndReservedSeatSection(
            reservationId,
            changedReservation.getSeats(), sectionCds,
            changedReservation.getRideDate(),
            changedReservation.getScheduleCd()
        );

        List<DepartureArrivalTimeEntity> schedules = departureArrivalTimeRepository.findByScheduleCd(changedReservation.getScheduleCd());

        LocalTime departureTime = schedules.stream()
            .filter(schedule -> schedule.getSectionKm().getStartStationCd().equals(changedReservation.getDepartureStationCd()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("DepartureTime is not found"))
            .getDepartureTime();

        LocalTime arrivalTime = schedules.stream()
            .filter(schedule -> schedule.getSectionKm().getGoalStationCd().equals(changedReservation.getArrivalStationCd()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("ArrivalTime is not found"))
            .getArrivalTime();

        if (changedReservation.getReserverMail() == null || changedReservation.getReserverMail().isBlank()) {
            changedReservation.setReserverMail(reservation.get().getReserverMail());
        }

        if (changedReservation.getReserverName() == null || changedReservation.getReserverName().isBlank()) {
            changedReservation.setReserverName(reservation.get().getReserverName());
        }

        eventPublisher.publishEvent(new ReservationChangedEvent(
            reservationId,
            changedReservation,
            departureTime,
            arrivalTime,
            oldTotalAmount
        ));

        return reservationId;
    }

    /**
     * 人数・座席変更メソッド
     *
     * @param reservationId      画面で選択した登録するべき予約情報
     * @param changedReservation 画面で選択した変更するべき予約情報
     * @param session            ログイン情報
     * @return 登録した予約情報ID
     */
    @Transactional
    public UUID putReservedSeat(UUID reservationId, ReserveRequestDto changedReservation, AccountSessionDto session) {
        Optional<ReservationEntity> reservation = putError(reservationId, changedReservation, session);
        Set<ReservedSeatEntity> reservedSeats = reservation.get().getReservedSeat();

        Integer oldTotalAmount = reservation.get().getReservedSeat().stream()
            .filter(seat -> seat.getSeatFare() != null)
            .mapToInt(ReservedSeatEntity::getSeatFare)
            .sum();

        // 削除対象座席Entityを抽出
        List<ReservedSeatEntity> deleteSeats = reservedSeats.stream()
            .filter(reserved -> changedReservation.getSeats().stream().noneMatch(changed -> isSame(changed, reserved)))
            .toList();

        // 追加対象座席リクエストを抽出
        List<ReserveRequestDto.SelectedSeatDto> postSeats = changedReservation.getSeats().stream()
            .filter(changed -> reservedSeats.stream().noneMatch(reserved -> isSame(changed, reserved)))
            .toList();

        if (!postSeats.isEmpty()) {
            List<String> sectionCds = getSectionCdList(changedReservation.getScheduleCd(),
                changedReservation.getDepartureStationCd(),
                changedReservation.getArrivalStationCd());

            insertReservedSeatAndReservedSeatSection(
                reservationId,
                postSeats, sectionCds,
                changedReservation.getRideDate(),
                changedReservation.getScheduleCd());
        }
        entityManager.flush();
        entityManager.clear();

        if (!deleteSeats.isEmpty()) {
            List<ReservedSeatSectionEntity> deleteSeatSections = deleteSeats.stream()
                .flatMap(seat -> seat.getReservedSeatSection().stream())
                .toList();
            reservedSeatRepository.deleteAll(deleteSeats);
            reservedSeatSectionRepository.deleteAll(deleteSeatSections);
        }

        List<DepartureArrivalTimeEntity> schedules = departureArrivalTimeRepository.findByScheduleCd(changedReservation.getScheduleCd());

        LocalTime departureTime = schedules.stream()
            .filter(schedule -> schedule.getSectionKm().getStartStationCd().equals(changedReservation.getDepartureStationCd()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("DepartureTime is not found"))
            .getDepartureTime();

        LocalTime arrivalTime = schedules.stream()
            .filter(schedule -> schedule.getSectionKm().getGoalStationCd().equals(changedReservation.getArrivalStationCd()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("ArrivalTime is not found"))
            .getArrivalTime();

        if (changedReservation.getReserverMail() == null || changedReservation.getReserverMail().isBlank()) {
            changedReservation.setReserverMail(reservation.get().getReserverMail());
        }

        if (changedReservation.getReserverName() == null || changedReservation.getReserverName().isBlank()) {
            changedReservation.setReserverName(reservation.get().getReserverName());
        }

        eventPublisher.publishEvent(new ReservationChangedEvent(
            reservationId,
            changedReservation,
            departureTime,
            arrivalTime,
            oldTotalAmount
        ));

        return reservationId;
    }

    /**
     * 変更エラー判定メソッド
     *
     * @param reservationId      画面で選択した登録するべき予約情報
     * @param changedReservation 画面で選択した変更するべき予約情報
     * @param session            ログイン情報
     * @return 予約IDに紐づく予約情報
     */
    @Transactional
    public Optional<ReservationEntity> putError(UUID reservationId, ReserveRequestDto changedReservation, AccountSessionDto session) {
        if (changedReservation.getSeats() == null || changedReservation.getSeats().isEmpty()) {
            throw new IllegalArgumentException("ChangedSeats is Null");
        }

        Optional<ReservationEntity> reservation = reservationRepository.findByIdAndIsDeleted(reservationId, false);
        if (session == null || !Objects.equals(reservation.get().getAccountId(), session.getId())) {
            throw new BadCredentialsException("Reservation doesn't match");
        }

        if (reservation.get().getReservedSeat().isEmpty()) {
            throw new IllegalArgumentException("Reserved Seats is Not found");
        }

        return reservation;
    }

    /**
     * 特定の予約情報IDに紐づく予約情報・予約座席情報を論理削除、予約済座席区間を物理削除するメソッド
     *
     * @param reservationId 予約情報ID
     */
    @Transactional
    public void deleteReservation(UUID reservationId, UUID accountId, String name, String mail) {
        ReservationEntity reservation;
        String reserverName;
        String reserverMail;
        if (accountId != null) {
            reservation = reservationRepository.findByIdAndAccountId(reservationId, accountId).orElseThrow(() -> new IllegalArgumentException("Reservation is not found"));
            AccountEntity account = accountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("Account is not found"));
            reserverName = account.getName();
            reserverMail = account.getMail();
        } else {
            if (name == null || mail == null) throw new IllegalArgumentException("Name and Mail is required");
            reservation =
                reservationRepository.findByIdAndReserverNameAndReserverMail(reservationId, name, mail).orElseThrow(() -> new IllegalArgumentException("Reservation is not found"));
            reserverName = name;
            reserverMail = mail;
        }
        reservation.setIsDeleted(true);

        List<ReservedSeatEntity> seats = reservedSeatRepository.findByReservationId(reservationId);
        if (seats.isEmpty()) {
            throw new IllegalArgumentException("Reserved Seats is Not found");
        }
        seats.forEach(seat -> seat.setIsDeleted(true));

        List<ReservedSeatSectionEntity> sections = reservedSeatSectionRepository.findByReservationId(reservationId);
        if (sections.isEmpty()) {
            throw new IllegalArgumentException("Reserved Seat Sections is Not found");
        }

        reservationRepository.save(reservation);
        reservedSeatRepository.saveAll(seats);
        reservedSeatSectionRepository.deleteAll(sections);

        List<ReserveRequestDto.SelectedSeatDto> seatDto = seats.stream()
            .map(seat -> new ReserveRequestDto.SelectedSeatDto(
                seat.getTrainCarCd(),
                trainCarRepository.findByTrainCarCd(seat.getTrainCarCd()).orElseThrow(() -> new IllegalArgumentException("TrainCar is not found")).getSeatType().getTrainCarTypeCd(),
                seat.getSeatCd(),
                seat.getSeatFare()
            )).toList();
        ReserveRequestDto reserveRequestDto = new ReserveRequestDto(
            reservation.getScheduleCd(),
            reservation.getRideDate(),
            reservation.getDepartureStationCd(),
            reservation.getArrivalStationCd(),
            reserverName,
            reserverMail,
            reservation.getPaymentTrackingId(),
            seatDto
        );

        List<DepartureArrivalTimeEntity> schedules = departureArrivalTimeRepository.findByScheduleCd(reservation.getScheduleCd());
        LocalTime departureTime = schedules.stream()
            .filter(schedule -> schedule.getSectionKm().getStartStationCd().equals(reservation.getDepartureStationCd()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("DepartureTime is not found"))
            .getDepartureTime();
        LocalTime arrivalTime = schedules.stream()
            .filter(schedule -> schedule.getSectionKm().getGoalStationCd().equals(reservation.getArrivalStationCd()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("ArrivalTime is not found"))
            .getArrivalTime();

        eventPublisher.publishEvent(new ReservationCanceledEvent(
            reservationId,
            reserveRequestDto,
            departureTime,
            arrivalTime
        ));
    }

    /**
     * 異なるオブジェクト型要素が一致するか比較するメソッド
     *
     * @param afterSeat  変更後座席
     * @param beforeSeat 変更前座席
     * @return 比較結果
     */
    private boolean isSame(ReserveRequestDto.SelectedSeatDto afterSeat, ReservedSeatEntity beforeSeat) {
        return Objects.equals(afterSeat.getTrainCarCd(), beforeSeat.getTrainCarCd())
            && Objects.equals(afterSeat.getSeatCd(), beforeSeat.getSeatCd());
    }
}
