package com.alab.shinkansendego.features.schedule.servicies;

import com.alab.shinkansendego.features.schedule.dtos.ReserveRequestDto;
import com.alab.shinkansendego.features.schedule.entities.PurchaseEntity;
import com.alab.shinkansendego.features.schedule.entities.PurchaseSeatEntity;
import com.alab.shinkansendego.features.schedule.repositories.PurchaseRepository;
import com.alab.shinkansendego.features.schedule.repositories.PurchaseSeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PurchaseService {
    private final PurchaseRepository purchaseRepository;
    private final PurchaseSeatRepository purchaseSeatRepository;

    @Autowired
    public PurchaseService(PurchaseRepository purchaseRepository, PurchaseSeatRepository purchaseSeatRepository) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseSeatRepository = purchaseSeatRepository;
    }

    @Transactional
    public UUID purchaseSeats(ReserveRequestDto reserveRequestDto) {
        if (reserveRequestDto.getSeats() == null || reserveRequestDto.getSeats().isEmpty()) {
            throw new IllegalArgumentException("Seats is Not found");
        }

        UUID purchaseId = UUID.randomUUID();
        PurchaseEntity purchase = new PurchaseEntity(
                purchaseId,
                reserveRequestDto.getRide_date(),
                reserveRequestDto.getSchedule_cd(),
                reserveRequestDto.getDeparture_station_cd(),
                reserveRequestDto.getArrival_station_cd()
        );
        int purchaseResult = purchaseRepository.insertPurchase(purchase);
        if (purchaseResult != 1) {
            throw new RuntimeException("Insert Purchase is failed");
        }

        List<PurchaseSeatEntity> purchaseSeats = new ArrayList<>();
        for (ReserveRequestDto.SelectedSeatDto seatDto : reserveRequestDto.getSeats()) {
            PurchaseSeatEntity purchaseSeat = new PurchaseSeatEntity(
                    UUID.randomUUID(), purchaseId, seatDto.getTrain_car_cd(), seatDto.getSeat_cd(), UUID.randomUUID()
            );
            purchaseSeats.add(purchaseSeat);
        }
        int purchaseSeatResult = purchaseSeatRepository.insertPurchaseSeats(purchaseSeats);
        if (purchaseSeatResult != reserveRequestDto.getSeats().size()) {
            throw new RuntimeException("Insert PurchaseSeats is failed");
        }

        return purchaseId;
    }
}
