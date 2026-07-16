package com.alab.shinkansendego.farekm;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FareKmService {
    private final BasicFareKmRepository basicRepo;
    private final ExpressFareKmRepository expressRepo;
    private final SupplementaryFareKmRepository supplementaryRepo;

    public FareKmService(
        BasicFareKmRepository basicFareKmRepository,
        ExpressFareKmRepository expressFareKmRepository,
        SupplementaryFareKmRepository supplementaryFareKmRepository
    ) {
        this.basicRepo = basicFareKmRepository;
        this.expressRepo = expressFareKmRepository;
        this.supplementaryRepo = supplementaryFareKmRepository;
    }

    /**
     * 営業キロ程を受け取って各席種の料金を返す
     *
     * @param distance 営業キロ程
     * @return 席種ごとの料金を持つHashMap
     */
    public Map<String, Integer> getFareFromDistance(Double distance) {
        Map<String, Integer> fares = new HashMap<>();

        if (distance == 0) {
            fares.put("non-reserved", 0);
            fares.put("reserved", 0);
            fares.put("green", 0);
            fares.put("gran-class", 0);
            return fares;
        }

        BasicFareKmEntity basicFareKmEntity = basicRepo.findByMinKmLessThanEqualAndMaxKmGreaterThan(distance, distance);
        ExpressFareKmEntity expressFareKmEntity = expressRepo.findByMinKmLessThanEqualAndMaxKmGreaterThan(distance, distance);
        SupplementaryFareKmEntity supplementaryFareKmEntity = supplementaryRepo.findByMinKmLessThanEqualAndMaxKmGreaterThan(distance, distance);

        Integer basicFare = basicFareKmEntity.getBasicFare() + expressFareKmEntity.getExpressFare();

        fares.put("non-reserved", basicFare);
        fares.put("reserved", basicFare + supplementaryFareKmEntity.getReservedFare());
        fares.put("green", basicFare + supplementaryFareKmEntity.getGreenFare());
        fares.put("gran-class", basicFare + supplementaryFareKmEntity.getGcFare());

        return fares;
    }
}
