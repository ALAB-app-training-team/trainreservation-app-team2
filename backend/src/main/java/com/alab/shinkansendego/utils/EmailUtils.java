package com.alab.shinkansendego.utils;

import com.alab.shinkansendego.email.EmailRequestDto;
import org.springframework.util.CollectionUtils;

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
    public static final String RELEASE_SUBJECT = "[割り当て解除] 同行者割り当て解除内容のご案内";
    public static final String CHANGE_SUBJECT = "[予約変更] 予約変更内容のご案内";
    public static final String SENDER_NAME = "新幹線でGO！";
    public static final Integer REFUND_FEE = 320;
    public static final String FROM_ADDRESS = "thashimoto@jeisryokai.onmicrosoft.com";
    public static final String CONFIRMATION_BODY = """
         %s さま

        「新幹線でGO!」アプリでチケットのご予約が完了いたしました。
         以下に予約詳細をお知らせいたします。

        ■予約詳細
        予約ID：%s
        乗車日：%s
        区間：%s（%s発）　→　%s（%s着）
        列車名：%s
        座席：%s
        お支払い合計：%,d 円

        ■アプリログインURL
        %s

        またのご利用をお待ちしております。
        """;
    public static final String CHANGE_BODY = """
         %s さま

        「新幹線でGO!」アプリをご利用いただきありがとうございます。
         以下に予約変更詳細をお知らせいたします。

        ■変更後予約詳細
        予約ID：%s
        乗車日：%s
        区間：%s（%s発）　→　%s（%s着）
        列車名：%s
        座席：%s
        お支払い合計：%s

        ■アプリログインURL
        %s

        またのご利用をお待ちしております。
        """;
    public static final String CANCEL_BODY = """
        %s さま

        「新幹線でGO!」アプリでチケットのキャンセルが完了いたしました。
        以下にキャンセル詳細をお知らせいたします。

        ■キャンセル詳細
        予約ID：%s
        乗車日：%s
        区間：%s（%s発）　→　%s（%s着）
        列車名：%s
        座席：%s
        手数料：%,d 円
        払戻金額：%,d 円

        ■アプリログインURL
        %s

        またのご利用をお待ちしております。
        """;
    public static final String RELEASE_BODY = """
        %s さま

        「新幹線でGO!」アプリをご利用いただきありがとうございます。
        同行者割り当てが解除されましたので以下よりご確認ください。

        ■割り当て解除詳細
        乗車日：%s
        区間：%s（%s発）　→　%s（%s着）
        列車名：%s
        座席：%s
        金額：%,d 円

        またのご利用をお待ちしております。
        """;

    public static String rideDateFormatter(LocalDate date) {
        return date.format(DateTimeFormatter.ofPattern("yyyy年MM月dd日"));
    }

    public static String seatFormatter(List<EmailRequestDto.SelectedSeatDto> seats) {
        if (CollectionUtils.isEmpty(seats)) {
            throw new IllegalArgumentException("メールの座席情報が指定されませんでした");
        }
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
            .collect(Collectors.joining("\n　　　"));
    }

    public static String differenceFormatter(int newAmount, Integer oldAmount) {
        if (oldAmount == null) {
            return String.format("%,d円", newAmount);
        }

        int diff = newAmount - oldAmount;
        String diffStr;
        if (diff > 0) {
            diffStr = String.format("変更差額　+%,d円", diff);
        } else if (diff < 0) {
            diffStr = String.format("変更差額　%,d円", diff);
        } else {
            diffStr = "変更差額なし";
        }
        return String.format("%,d円 (%s)", newAmount, diffStr);
    }
}
