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
    public static final String ALL_GENDER_RESTROOM = "男女共用トイレ";
    public static final String MENS_RESTROOM = "男性用トイレ";
    public static final String WOMENS_RESTROOM = "女性用トイレ";
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
            case ALL_GENDER_RESTROOM -> dto.setHasAllGenderRestroom(true);
            case MENS_RESTROOM -> dto.setHasMensRestroom(true);
            case WOMENS_RESTROOM -> dto.setHasWomensRestroom(true);
            case WHEELCHAIR_RESTROOM -> dto.setHasWheelchairRestroom(true);
            case BABY_CHANGING_TABLE -> dto.setHasBabyChangingTable(true);
            case LUGGAGE_STORAGE -> dto.setHasLuggageStorage(true);
            case MULTIPURPOSE_ROOM -> dto.setHasMultipurposeRoom(true);
            default -> {
            }
        }
    }
}
