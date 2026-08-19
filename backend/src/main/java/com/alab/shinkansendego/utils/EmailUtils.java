package com.alab.shinkansendego.utils;

import com.alab.shinkansendego.email.EmailRequestDto;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public final class EmailUtils {
    private EmailUtils() {

    }

    public static final String LOGIN_PATH = "/login";
    public static final String SUBJECT = "[予約完了] 予約内容のご案内";
    public static final String CANCEL_SUBJECT = "[予約キャンセル] 予約キャンセル内容のご案内";
    public static final String SENDER_NAME = "新幹線でGO！";
    public static final String CANCEL_BODY = """
        %s さま

        「新幹線でGO!」アプリをご利用いただきありがとうございます。
        以下の予約キャンセルをお知らせいたします。

        ■予約キャンセル内容
        予約ID：%s
        乗車日：%s
        区間：%s（%s発）　→　%s（%s着）
        列車名：%s
        座席：%s
        払戻手数料：%,d 円
        払戻合計金額：%,d 円

        ■アプリログインURL
        %s

        またのご利用をお待ちしております。
        """;

    public static String rideDateFormatter(LocalDate date) {
        return date.format(DateTimeFormatter.ofPattern("yyyy年MM月dd日"));
    }

    public static String seatFormatter(List<EmailRequestDto.SelectedSeatDto> seats) {
        return seats.stream()
            .map(seat -> {
                String rawCarCd = seat.getTrainCarCd();
                String carNum = "";
                if (rawCarCd != null && rawCarCd.length() >= 2) {
                    carNum = rawCarCd.substring(rawCarCd.length() - 2).replaceFirst("^0+", "");
                }

                return String.format("%s号車 %s",
                    carNum,
                    seat.getSeatCd());
            })
            .collect(Collectors.joining("\n"));
    }
}
