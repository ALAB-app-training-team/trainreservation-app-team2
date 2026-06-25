package com.alab.shinkansendego.features.schedule.services;

import com.alab.shinkansendego.features.schedule.dtos.ReserveRequestDto;
import com.alab.shinkansendego.features.schedule.repositories.PurchaseRepository;
import com.alab.shinkansendego.features.schedule.repositories.PurchaseSeatRepository;
import com.alab.shinkansendego.features.schedule.servicies.PurchaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class PurchaseServiceTest {
    @Mock
    private PurchaseRepository purchaseRepo;
    @Mock
    private PurchaseSeatRepository purchaseSeatRepo;
    @InjectMocks
    private PurchaseService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("購入情報・購入座席情報を挿入できる")
    void purchaseSeats_withValidReserveRequestDto_returnPurchaseId() {
        ReserveRequestDto request = new ReserveRequestDto(
                "Test01", LocalDate.now(), "Test0", "Test1", List.of(
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"),
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002")
        ));
        when(purchaseRepo.insertPurchase(any())).thenReturn(1);
        when(purchaseSeatRepo.insertPurchaseSeats(any())).thenReturn(request.getSeats().size());

        UUID result = service.purchaseSeats(request);
        assertNotNull(result);
    }

    @Test
    @DisplayName("座席リストが空の場合、IllegalArgumentExceptionが発生する")
    void purchaseSeats_withEmptySelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto(
                "Test01", LocalDate.now(), "Test0", "Test1", List.of());
        assertThrows(IllegalArgumentException.class, () -> {
            service.purchaseSeats(request);
        });
    }

    @Test
    @DisplayName("座席リストがnullの場合、IllegalArgumentExceptionが発生する")
    void purchaseSeats_withNullSelectedSeatDto_throwsIllegalArgumentException() {
        ReserveRequestDto request = new ReserveRequestDto(
                "Test01", LocalDate.now(), "Test0", "Test1", null);
        assertThrows(IllegalArgumentException.class, () -> {
            service.purchaseSeats(request);
        });
    }

    @Test
    @DisplayName("insertPurchaseが失敗した場合、RuntimeExceptionが発生する")
    void purchaseSeats_withInsertPurchaseFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto(
                "Test01", LocalDate.now(), "Test0", "Test1", List.of(
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"),
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002")
        ));
        when(purchaseRepo.insertPurchase(any())).thenReturn(0);
        assertThrows(RuntimeException.class, () -> {
            service.purchaseSeats(request);
        });
    }

    @Test
    @DisplayName("insertPurchaseSeatsが失敗した場合、RuntimeExceptionが発生する")
    void purchaseSeats_withInsertPurchaseSeatsFails_throwsRuntimeException() {
        ReserveRequestDto request = new ReserveRequestDto(
                "Test01", LocalDate.now(), "Test0", "Test1", List.of(
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01001"),
                new ReserveRequestDto.SelectedSeatDto("E5SER01", "SEAT01002")
        ));
        when(purchaseRepo.insertPurchase(any())).thenReturn(1);
        when(purchaseSeatRepo.insertPurchaseSeats(any())).thenReturn(0);

        assertThrows(RuntimeException.class, () -> {
            service.purchaseSeats(request);
        });
    }
}
