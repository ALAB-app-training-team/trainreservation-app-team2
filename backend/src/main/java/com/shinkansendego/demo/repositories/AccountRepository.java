package com.shinkansendego.demo.repositories;
import org.apache.ibatis.annotations.Mapper;

import com.shinkansendego.demo.entities.Account;

import java.util.List;

@Mapper
public interface AccountRepository {
    List<Account> findAllAccounts();
}