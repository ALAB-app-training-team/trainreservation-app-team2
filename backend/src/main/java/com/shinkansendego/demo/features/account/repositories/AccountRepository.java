package com.shinkansendego.demo.features.account.repositories;

import com.shinkansendego.demo.features.account.entities.AccountEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AccountRepository {
    List<AccountEntity> findAllAccounts();
}
