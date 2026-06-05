package com.shinkansendego.demo.feature.account.repositories;

import com.shinkansendego.demo.feature.account.entities.AccountEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AccountRepository {
    List<AccountEntity> findAllAccounts();
}
