package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.reservation.ReservationEntity;
import com.alab.shinkansendego.reservation.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ReservedSeatServiceTest {
    @Mock
    private ReservationRepository reservationRepo;
    @Mock
    private ReservedSeatRepository reservedSeatRepo;
    private ReservedSeatService service;
    private final UUID reservationId = UUID.randomUUID();
    private final UUID accountId = UUID.randomUUID();
    private final UUID reservedSeat1Id = UUID.randomUUID();
    private final UUID reservedSeat2Id = UUID.randomUUID();
    private ReservedSeatUpdateDto reservedSeatUpdateDto1;
    private ReservedSeatUpdateDto reservedSeatUpdateDto2;
    private List<ReservedSeatUpdateDto> updateRequest;
    private ReservationEntity reservation;
    private ReservedSeatEntity reservedSeat1;
    private ReservedSeatEntity reservedSeat2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        this.service = new ReservedSeatService(reservationRepo, reservedSeatRepo);

        reservedSeatUpdateDto1 = new ReservedSeatUpdateDto(reservedSeat1Id, "一般次郎",
            "test2-common@test.com");
        reservedSeatUpdateDto2 = new ReservedSeatUpdateDto(reservedSeat2Id, "",
            "");
        updateRequest = List.of(reservedSeatUpdateDto1, reservedSeatUpdateDto2);
        reservation = new ReservationEntity();
        reservation.setId(reservationId);
        reservation.setAccountId(accountId);
        reservation.setIsDeleted(false);
        reservation.setReserverName("一般太郎");
        reservation.setReserverMail("test-common@test.com");
        reservedSeat1 = new ReservedSeatEntity();
        reservedSeat1.setId(reservedSeat1Id);
        reservedSeat1.setReservationId(reservationId);
        reservedSeat1.setIsDeleted(false);
        reservedSeat1.setName("");
        reservedSeat1.setMail("");
        reservedSeat2 = new ReservedSeatEntity();
        reservedSeat2.setId(reservedSeat2Id);
        reservedSeat2.setReservationId(reservationId);
        reservedSeat2.setIsDeleted(false);
        reservedSeat2.setName("");
        reservedSeat2.setMail("");
    }

    @Test
    @DisplayName("ログインユーザーが同行者を割り当てできる")
    void updateReservedSeats_withAuthorized() {
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false)).thenReturn(Optional.of(reservedSeat1));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false)).thenReturn(Optional.of(reservedSeat2));

        service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        assertEquals("一般次郎", reservedSeat1.getName());
        assertEquals("test2-common@test.com", reservedSeat1.getMail());
        assertEquals("", reservedSeat2.getName());
        assertEquals("", reservedSeat2.getMail());

        verify(reservationRepo, times(1)).findById(reservationId);
        verify(reservedSeatRepo, times(1)).findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false);
        verify(reservedSeatRepo, times(1)).findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false);
    }

    @Test
    @DisplayName("ゲストユーザーが同行者を割り当てできる")
    void updateReservedSeats_withNotAuthorized() {
        reservation.setAccountId(null);
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false)).thenReturn(Optional.of(reservedSeat1));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false)).thenReturn(Optional.of(reservedSeat2));

        service.updateReservedSeats(reservationId, updateRequest, null, "一般太郎", "test-common@test.com");
        assertEquals("一般次郎", reservedSeat1.getName());
        assertEquals("test2-common@test.com", reservedSeat1.getMail());
        assertEquals("", reservedSeat2.getName());
        assertEquals("", reservedSeat2.getMail());

        verify(reservationRepo, times(1)).findById(reservationId);
        verify(reservedSeatRepo, times(1)).findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false);
        verify(reservedSeatRepo, times(1)).findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false);
    }

    @Test
    @DisplayName("Reservationが見つからなかった場合、IllegalArgumentExceptionを投げる")
    void updateReservedSeats_withReservationNotFound() {
        reservation.setAccountId(UUID.randomUUID());
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("Reservation is Not found", exception.getMessage());
    }

    @Test
    @DisplayName("Reservationが削除済みの場合、IllegalArgumentExceptionを投げる")
    void updateReservedSeats_withReservationIsDeleted() {
        reservation.setIsDeleted(true);
        reservation.setAccountId(UUID.randomUUID());
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("Reservation is Not found", exception.getMessage());
    }

    @Test
    @DisplayName("ログインユーザーが権限のない予約を更新しようとした場合、AccessDeniedExceptionを投げる")
    void updateReservedSeats_withAuthorizedAndUnauthorizedReservation() {
        reservation.setAccountId(UUID.randomUUID());
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("Forbidden", exception.getMessage());
    }

    @Test
    @DisplayName("ゲストユーザーがアカウントIDが登録済みの予約を更新しようとした場合、AccessDeniedExceptionを投げる")
    void updateReservedSeats_withNotAuthorizedAndReservationAccountId() {
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, null, "一般太郎", "test-common@test.com");
        });
        assertEquals("Login Required", exception.getMessage());
    }

    @Test
    @DisplayName("同行者が予約を更新しようとした場合、AccessDeniedExceptionを投げる")
    void updateReservedSeats_withNotAuthorizedAndCompanionUser() {
        reservation.setAccountId(null);
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));

        AccessDeniedException exception = assertThrows(AccessDeniedException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, null, "一般次郎", "test2-common@test.com");
        });
        assertEquals("Forbidden", exception.getMessage());
    }

    @Test
    @DisplayName("ReservationSeatが見つからなかった場合、IllegalArgumentExceptionを投げる")
    void updateReservedSeats_withDeletedReservedSeat() {
        when(reservationRepo.findById(reservationId)).thenReturn(Optional.of(reservation));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat1Id, reservationId, false)).thenReturn(Optional.of(reservedSeat1));
        when(reservedSeatRepo.findByIdAndReservationIdAndIsDeleted(reservedSeat2Id, reservationId, false)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            service.updateReservedSeats(reservationId, updateRequest, accountId, null, null);
        });
        assertEquals("ReservedSeat is Not found", exception.getMessage());
    }
}
