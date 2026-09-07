package com.alab.shinkansendego.utils;

import com.alab.shinkansendego.email.reservation.ReservationEmailRequestParams.SelectedSeatParams;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class EmailUtilsTest {

    @Test
    @DisplayName("乗車日を和暦形式でフォーマットする")
    void rideDateFormatter_returnsJapaneseFormat() {
        assertEquals("2026年01月05日", EmailUtils.rideDateFormatter(LocalDate.of(2026, 1, 5)));
    }

    @Test
    @DisplayName("座席が1件のとき、号車番号の先頭ゼロを除去する")
    void seatFormatter_withSingleSeat_trimsLeadingZeroOfCarNumber() {
        List<SelectedSeatParams> seats = List.of(
            new SelectedSeatParams("N70003", "R", "12番A席", 13000)
        );
        assertEquals("3号車 12番A席", EmailUtils.seatFormatter(seats));
    }

    @Test
    @DisplayName("座席が複数のとき、改行とインデントで連結する")
    void seatFormatter_withMultipleSeats_joinsWithNewline() {
        List<SelectedSeatParams> seats = List.of(
            new SelectedSeatParams("N70003", "R", "12番A席", 13000),
            new SelectedSeatParams("N70011", "G", "1番D席", 20000)
        );
        assertEquals("3号車 12番A席\n　　　11号車 1番D席", EmailUtils.seatFormatter(seats));
    }

    @Test
    @DisplayName("座席が空だとIllegalArgumentExceptionが発生する")
    void seatFormatter_withEmptySeats_throwsIllegalArgumentException() {
        IllegalArgumentException e = assertThrows(
            IllegalArgumentException.class,
            () -> EmailUtils.seatFormatter(List.of())
        );
        assertEquals("メールの座席情報が指定されませんでした", e.getMessage());
    }

    @Test
    @DisplayName("旧金額がnullのとき、差額表記なしで金額のみ返す")
    void differenceFormatter_withNullOldAmount_returnsAmountOnly() {
        assertEquals("13,000円", EmailUtils.differenceFormatter(13000, null));
    }

    @Test
    @DisplayName("増額のとき、プラス符号つきの差額を付ける")
    void differenceFormatter_withIncrease_returnsPlusSign() {
        assertEquals("20,000円 (変更差額　+7,000円)", EmailUtils.differenceFormatter(20000, 13000));
    }

    @Test
    @DisplayName("減額のとき、マイナスの差額を付ける")
    void differenceFormatter_withDecrease_returnsMinusSign() {
        assertEquals("13,000円 (変更差額　-7,000円)", EmailUtils.differenceFormatter(13000, 20000));
    }

    @Test
    @DisplayName("同額のとき、変更差額なしと表示する")
    void differenceFormatter_withSameAmount_returnsNoDifference() {
        assertEquals("13,000円 (変更差額なし)", EmailUtils.differenceFormatter(13000, 13000));
    }
}
