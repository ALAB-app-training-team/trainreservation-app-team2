package com.alab.shinkansendego.utils;

import com.alab.shinkansendego.traincar.FacilityDto;

public final class FacilityUtils {
    private FacilityUtils() {
    }

    /**
     * 設備位置
     */
    public static final String POSITION_FRONT = "FRONT";
    public static final String POSITION_REAR = "REAR";
    /**
     * 設備名
     */
    public static final String UNISEX_RESTROOM = "男女兼用トイレ";
    public static final String MEN_RESTROOM = "男性用トイレ";
    public static final String WOMEN_RESTROOM = "女性用トイレ";
    public static final String WHEELCHAIR_RESTROOM = "車いす対応トイレ";
    public static final String BABY_CHANGING_TABLE = "ベビーベッド";
    public static final String LUGGAGE_STORAGE = "荷物置き場";
    public static final String MULTIPURPOSE_ROOM = "多目的室";

    /**
     * 設備が存在するか判定してDTOに結果を設定して返すメソッド
     *
     * @param dto          設定先のDTO
     * @param facilityName 設備種別名
     */
    public static void setFacilityDto(FacilityDto dto, String facilityName) {
        switch (facilityName) {
            case UNISEX_RESTROOM -> dto.setIsUnisexRestroom(true);
            case MEN_RESTROOM -> dto.setIsMenRestroom(true);
            case WOMEN_RESTROOM -> dto.setIsWomenRestroom(true);
            case WHEELCHAIR_RESTROOM -> dto.setIsWheelchairRestroom(true);
            case BABY_CHANGING_TABLE -> dto.setIsBabyChangingTable(true);
            case LUGGAGE_STORAGE -> dto.setIsLuggageStorage(true);
            case MULTIPURPOSE_ROOM -> dto.setIsMultipurposeRoom(true);
        }
    }
}
