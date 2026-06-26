package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.entities.PurchaseEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PurchaseRepository {
    int insertPurchase(PurchaseEntity purchaseEntity);
}
