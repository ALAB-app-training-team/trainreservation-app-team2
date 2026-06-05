package com.shinkansendego.demo.feature.account.repositories;
import org.apache.ibatis.annotations.Mapper;

import com.shinkansendego.demo.feature.account.entities.AccountEntity;

import java.util.List;

@Mapper
public interface AccountRepository {
    List<AccountEntity> findAllAccounts();
}
