package com.alab.shinkansendego.utils;

import com.alab.shinkansendego.traincar.FacilityDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FacilityUtilsTest {
    private static FacilityDto allFalseDto() {
        return new FacilityDto(FacilityUtils.POSITION_FRONT, false, false, false, false, false, false, false);
    }

    /**
     * 設備フラグをDTOのフィールド定義順に並べて返す
     * (男女共用トイレ, 男性用トイレ, 女性用トイレ, 車いす対応トイレ, ベビーベッド, 荷物置き場, 多目的室)
     */
    private static List<Boolean> flagsOf(FacilityDto dto) {
        return List.of(
            dto.getHasAllGenderRestroom(),
            dto.getHasMensRestroom(),
            dto.getHasWomensRestroom(),
            dto.getHasWheelchairRestroom(),
            dto.getHasBabyChangingTable(),
            dto.getHasLuggageStorage(),
            dto.getHasMultipurposeRoom()
        );
    }

    @Test
    @DisplayName("男女共用トイレのとき、hasAllGenderRestroomにtrueを設定する")
    void setFacilityDto_withAllGenderRestroom_setsOnlyAllGenderRestroom() {
        FacilityDto dto = allFalseDto();
        FacilityUtils.setFacilityDto(dto, FacilityUtils.ALL_GENDER_RESTROOM);
        assertEquals(List.of(true, false, false, false, false, false, false), flagsOf(dto));
    }

    @Test
    @DisplayName("男性用トイレのとき、hasMensRestroomにtrueを設定する")
    void setFacilityDto_withMensRestroom_setsOnlyMensRestroom() {
        FacilityDto dto = allFalseDto();
        FacilityUtils.setFacilityDto(dto, FacilityUtils.MENS_RESTROOM);
        assertEquals(List.of(false, true, false, false, false, false, false), flagsOf(dto));
    }

    @Test
    @DisplayName("女性用トイレのとき、hasWomensRestroomのみtrue")
    void setFacilityDto_withWomensRestroom_setsOnlyWomensRestroom() {
        FacilityDto dto = allFalseDto();
        FacilityUtils.setFacilityDto(dto, FacilityUtils.WOMENS_RESTROOM);
        assertEquals(List.of(false, false, true, false, false, false, false), flagsOf(dto));
    }

    @Test
    @DisplayName("車いす対応トイレのとき、hasWheelchairRestroomにtrueを設定する")
    void setFacilityDto_withWheelchairRestroom_setsOnlyWheelchairRestroom() {
        FacilityDto dto = allFalseDto();
        FacilityUtils.setFacilityDto(dto, FacilityUtils.WHEELCHAIR_RESTROOM);
        assertEquals(List.of(false, false, false, true, false, false, false), flagsOf(dto));
    }

    @Test
    @DisplayName("ベビーベッドのとき、hasBabyChangingTableにtrueを設定する")
    void setFacilityDto_withBabyChangingTable_setsOnlyBabyChangingTable() {
        FacilityDto dto = allFalseDto();
        FacilityUtils.setFacilityDto(dto, FacilityUtils.BABY_CHANGING_TABLE);
        assertEquals(List.of(false, false, false, false, true, false, false), flagsOf(dto));
    }

    @Test
    @DisplayName("荷物置き場のとき、hasLuggageStorageにtrueを設定する")
    void setFacilityDto_withLuggageStorage_setsOnlyLuggageStorage() {
        FacilityDto dto = allFalseDto();
        FacilityUtils.setFacilityDto(dto, FacilityUtils.LUGGAGE_STORAGE);
        assertEquals(List.of(false, false, false, false, false, true, false), flagsOf(dto));
    }

    @Test
    @DisplayName("多目的室のとき、hasMultipurposeRoomのみtrue")
    void setFacilityDto_withMultipurposeRoom_setsOnlyMultipurposeRoom() {
        FacilityDto dto = allFalseDto();
        FacilityUtils.setFacilityDto(dto, FacilityUtils.MULTIPURPOSE_ROOM);
        assertEquals(List.of(false, false, false, false, false, false, true), flagsOf(dto));
    }

    @Test
    @DisplayName("複数の設備を設定したとき、該当するフラグがすべてtrue")
    void setFacilityDto_withMultipleFacilities_setsEachFlag() {
        FacilityDto dto = allFalseDto();
        FacilityUtils.setFacilityDto(dto, FacilityUtils.ALL_GENDER_RESTROOM);
        FacilityUtils.setFacilityDto(dto, FacilityUtils.LUGGAGE_STORAGE);
        FacilityUtils.setFacilityDto(dto, FacilityUtils.MULTIPURPOSE_ROOM);
        assertEquals(List.of(true, false, false, false, false, true, true), flagsOf(dto));
    }

    @Test
    @DisplayName("定義されていない設備名のとき、どのフラグも変更されない")
    void setFacilityDto_withUnknownFacilityName_changesNothing() {
        FacilityDto dto = allFalseDto();
        FacilityUtils.setFacilityDto(dto, "自動販売機");
        assertEquals(List.of(false, false, false, false, false, false, false), flagsOf(dto));
    }

    @Test
    @DisplayName("設備名を設定してもpositionは変更されない")
    void setFacilityDto_doesNotChangePosition() {
        FacilityDto dto = allFalseDto();
        FacilityUtils.setFacilityDto(dto, FacilityUtils.ALL_GENDER_RESTROOM);
        assertEquals(FacilityUtils.POSITION_FRONT, dto.getPosition());
    }
}
