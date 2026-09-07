package com.alab.shinkansendego.email.account;

import com.alab.shinkansendego.account.AccountCreatedEvent;
import com.alab.shinkansendego.account.AccountRequestDto;
import com.alab.shinkansendego.account.AccountUpdatedEvent;
import com.alab.shinkansendego.account.PasswordUpdatedEvent;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AccountEventListenerTest {

    @Mock
    private AccountEmailService accountEmailService;
    @InjectMocks
    private AccountEventListener listener;

    private AccountRequestDto accountRequest(String name, String mail) {
        return new AccountRequestDto(name, mail, "password");
    }

    @Test
    @DisplayName("アカウント作成イベントで作成完了メールを送信する")
    void handleAccountCreated_sendsAccountCreateMail() {
        AccountCreatedEvent event = new AccountCreatedEvent(accountRequest("山田太郎", "new@example.com"));

        listener.handleAccountCreated(event);

        verify(accountEmailService, times(1)).sendAccountCreate(
            eq(new AccountEmailRequestParams("new@example.com", "山田太郎"))
        );
    }

    @Test
    @DisplayName("メールアドレス変更なしの場合は新アドレス宛に1通だけ変更完了メールを送信する")
    void handleAccountChanged_withoutMailChange_sendsUpdateMailOnce() {
        AccountUpdatedEvent event = new AccountUpdatedEvent(
            accountRequest("新氏名", "same@example.com"),
            accountRequest("旧氏名", "same@example.com")
        );

        listener.handleAccountChanged(event);

        verify(accountEmailService, times(1)).sendAccountUpdate(
            eq(new AccountEmailRequestParams("same@example.com", "新氏名")),
            eq(new AccountEmailRequestParams(null, "旧氏名"))
        );
    }

    @Test
    @DisplayName("メールアドレス変更ありの場合は新旧両方のアドレス宛に変更完了メールを送信する")
    void handleAccountChanged_withMailChange_sendsUpdateMailToBothAddresses() {
        AccountUpdatedEvent event = new AccountUpdatedEvent(
            accountRequest("新氏名", "new@example.com"),
            accountRequest("旧氏名", "old@example.com")
        );

        listener.handleAccountChanged(event);

        verify(accountEmailService, times(1)).sendAccountUpdate(
            eq(new AccountEmailRequestParams("new@example.com", "新氏名")),
            eq(new AccountEmailRequestParams(null, "旧氏名"))
        );
        verify(accountEmailService, times(1)).sendAccountUpdate(
            eq(new AccountEmailRequestParams("new@example.com", "新氏名")),
            eq(new AccountEmailRequestParams("old@example.com", "旧氏名"))
        );
    }

    @Test
    @DisplayName("旧メールアドレスが存在しない場合は変更完了メールを送信しない")
    void handleAccountChanged_withNoOldMail_doesNotSendUpdateMail() {
        AccountUpdatedEvent event = new AccountUpdatedEvent(
            accountRequest("新氏名", "new@example.com"),
            accountRequest("旧氏名", null)
        );

        listener.handleAccountChanged(event);

        verify(accountEmailService, never()).sendAccountUpdate(any(), any());
    }

    @Test
    @DisplayName("パスワード変更イベントでパスワード変更完了メールを送信する")
    void handlePasswordChanged_sendsPasswordUpdateMail() {
        PasswordUpdatedEvent event = new PasswordUpdatedEvent(accountRequest("山田太郎", "user@example.com"));

        listener.handlePasswordChanged(event);

        verify(accountEmailService, times(1)).sendPasswordUpdate(
            eq(new AccountEmailRequestParams("user@example.com", "山田太郎"))
        );
    }
}
