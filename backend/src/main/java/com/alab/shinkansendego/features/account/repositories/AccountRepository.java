package com.alab.shinkansendego.features.account.repositories;

import com.alab.shinkansendego.features.account.entities.AccountEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AccountRepository {
    List<AccountEntity> findAllAccounts();
}
