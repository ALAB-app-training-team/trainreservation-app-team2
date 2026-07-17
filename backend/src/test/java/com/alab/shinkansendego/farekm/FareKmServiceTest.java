package com.alab.shinkansendego.farekm;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FareKmServiceTest {
    @Mock
    BasicFareKmRepository basicFareKmRepository;
    @Mock
    ExpressFareKmRepository expressFareKmRepository;
    @Mock
    SupplementaryFareKmRepository supplementaryFareKmRepository;
    @InjectMocks
    FareKmService service;
    private final BasicFareKmEntity basicFareMock = new BasicFareKmEntity("BF038", 520, 540, 9020);
    private final ExpressFareKmEntity expressFareMock = new ExpressFareKmEntity("EF007", 500, 600, 5170);
    private final SupplementaryFareKmEntity supplementaryFareMock = new SupplementaryFareKmEntity("SF004", 400, 600, 530, 5400, 12400);

    @Test
    void getFare_HelloTest() {
        assertEquals(2, 1 + 1);
    }

    @Test
    @DisplayName("営業キロ程を受け取って各席種の料金を返す")
    void getFare_returnFare() {
        Double moriokaKm = 535.3;
        when(basicFareKmRepository.findAll()).thenReturn(List.of(basicFareMock));
        when(expressFareKmRepository.findAll()).thenReturn(List.of(expressFareMock));
        when(supplementaryFareKmRepository.findAll()).thenReturn(List.of(supplementaryFareMock));

        Map<String, Integer> fares = service.getFareFromDistance(moriokaKm);

        assertAll(
            () -> assertEquals(14190, fares.get("non-reserved")),
            () -> assertEquals(14720, fares.get("reserved")),
            () -> assertEquals(19590, fares.get("green")),
            () -> assertEquals(26590, fares.get("gran-class"))
        );
    }

    @Test
    @DisplayName("営業キロ程が0のときIllegalArgumentExceptionを返す")
    void getFare_with0km_throwIllegalArgumentException() {
        Double zeroKm = 0.0;

        assertThrows(IllegalArgumentException.class, () -> service.getFareFromDistance(zeroKm));
    }

    @Test
    @DisplayName("営業キロ程が0kmより小さいときIllegalArgumentExceptionを返す")
    void getFare_withUnder0km_throwIllegalArgumentException() {
        Double underZeroKm = -1.0;

        assertThrows(IllegalArgumentException.class, () -> service.getFareFromDistance(underZeroKm));
    }

    @Test
    @DisplayName("営業キロ程が800kmより大きいときIllegalArgumentExceptionを返す")
    void getFare_withOver800km_returnAllFare0() {
        Double overKm = 800.1;

        assertThrows(IllegalArgumentException.class, () -> service.getFareFromDistance(overKm));
    }

    @Test
    @DisplayName("乗車券料金テーブルからデータを取得できなかったときIllegalArgumentExceptionを返す")
    void getFare_withNoBasicFareTableData_throwIllegalArgumentException() {
        Double morioka = 535.3;
        when(basicFareKmRepository.findAll()).thenReturn(List.of());

        assertThrows(IllegalArgumentException.class, () -> service.getFareFromDistance(morioka));
    }

    @Test
    @DisplayName("特急券料金テーブルからデータを取得できなかったときIllegalArgumentExceptionを返す")
    void getFare_withNoExpressFareTableData_throwIllegalArgumentException() {
        Double morioka = 535.3;
        when(basicFareKmRepository.findAll()).thenReturn(List.of(basicFareMock));
        when(expressFareKmRepository.findAll()).thenReturn(List.of());

        assertThrows(IllegalArgumentException.class, () -> service.getFareFromDistance(morioka));
    }

    @Test
    @DisplayName("設備券料金テーブルからデータを取得できなかったときIllegalArgumentExceptionを返す")
    void getFare_withNoSupplementaryFareTableData_throwIllegalArgumentException() {
        Double morioka = 535.3;
        when(basicFareKmRepository.findAll()).thenReturn(List.of(basicFareMock));
        when(expressFareKmRepository.findAll()).thenReturn(List.of(expressFareMock));
        when(supplementaryFareKmRepository.findAll()).thenReturn(List.of());

        assertThrows(IllegalArgumentException.class, () -> service.getFareFromDistance(morioka));
    }
}
