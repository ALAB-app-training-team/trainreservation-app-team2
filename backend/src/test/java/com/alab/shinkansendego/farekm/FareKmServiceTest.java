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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FareKmServiceTest {
    private BasicFareKmEntity basicFareMock = new BasicFareKmEntity("BF038", 520, 540, 9020);
    private ExpressFareKmEntity expressFareMock = new ExpressFareKmEntity("EF007", 500, 600, 5170);
    private SupplementaryFareKmEntity supplementaryFareMock = new SupplementaryFareKmEntity("SF004", 400, 600, 530, 5400, 12400);
    @Mock
    BasicFareKmRepository basicFareKmRepository;
    @Mock
    ExpressFareKmRepository expressFareKmRepository;
    @Mock
    SupplementaryFareKmRepository supplementaryFareKmRepository;
    @InjectMocks
    FareKmService service;

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
    @DisplayName("営業キロ程が0の時は各席種の料金を0円で返す")
    void getFare_with0km_returnAllFare0() {
        Double moriokaKm = 0.0;

        Map<String, Integer> fares = service.getFareFromDistance(moriokaKm);

        assertAll(
            () -> assertEquals(0, fares.get("non-reserved")),
            () -> assertEquals(0, fares.get("reserved")),
            () -> assertEquals(0, fares.get("green")),
            () -> assertEquals(0, fares.get("gran-class"))
        );
    }
}
