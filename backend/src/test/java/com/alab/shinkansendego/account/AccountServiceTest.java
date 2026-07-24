package com.alab.shinkansendego.account;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class AccountServiceTest {
    private AccountService service;
    @Mock
    private AccountRepository accountRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        this.service = new AccountService(accountRepository);
    }

    @Test
    @DisplayName("ログインできること")
    void getReservationList_withReserverNameAndEmail_returnGetReservationListSuccess() throws Exception {
    }
}
