package com.alab.shinkansendego.utils;

public final class EmailUtils {
    private EmailUtils() {

    }

    public static final String LOGIN_PATH = "/login";
    public static final String SUBJECT = "[予約完了] 予約内容のご案内";
    public static final String SENDER_NAME = "新幹線でGO！";
    public static final String RESERVATION_CONFIRMATION_BODY = """
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
}
