package com.alab.shinkansendego.utils;

public final class StringUtils {
    private StringUtils() {
    }

    /**
     * 文字列から全角半角の空白をすべて除く
     *
     * @param value 対象の文字列
     * @return 空白がすべて除かれた対象文字列
     */
    public static String removeSpaces(String value) {
        return value == null ? null : value.replaceAll("[\\s\u3000]", "");
    }
}
