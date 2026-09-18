import {
    MdOutlineAccessible,
    MdOutlineBabyChangingStation,
    MdOutlineMan,
    MdOutlineMeetingRoom,
    MdOutlineWc,
    MdOutlineWoman,
} from 'react-icons/md';
import { RiLuggageDepositLine } from 'react-icons/ri';

import { FACILITY_LABELS } from '@/features/schedule/constants/FacilityLabels';
import type { FacilityItem } from '@/features/schedule/types/FacilityItem';

export const FACILITY_ITEM_LIST: FacilityItem[] = [
    {
        facilityKey: 'hasAllGenderRestroom',
        icon: MdOutlineWc,
        label: FACILITY_LABELS.ALL_GENDER_RESTROOM,
        description: '男女どなたでも利用できるトイレです。',
        iconClassName: 'text-facility-all-gender',
    },
    {
        facilityKey: 'hasMensRestroom',
        icon: MdOutlineMan,
        label: FACILITY_LABELS.MENS_RESTROOM,
        description: '男性専用のトイレです。',
        iconClassName: 'text-facility-mens',
    },
    {
        facilityKey: 'hasWomensRestroom',
        icon: MdOutlineWoman,
        label: FACILITY_LABELS.WOMENS_RESTROOM,
        description: '女性専用のトイレです。',
        iconClassName: 'text-facility-womens',
    },
    {
        facilityKey: 'hasWheelchairRestroom',
        icon: MdOutlineAccessible,
        label: FACILITY_LABELS.WHEELCHAIR_RESTROOM,
        description: '車いすのまま利用できる広いトイレです。',
        iconClassName: 'text-facility-wheelchair',
    },
    {
        facilityKey: 'hasBabyChangingTable',
        icon: MdOutlineBabyChangingStation,
        label: FACILITY_LABELS.BABY_CHANGING_TABLE,
        description: 'おむつ替えができるベビーベッドがあります。',
        iconClassName: 'text-facility-baby',
    },
    {
        facilityKey: 'hasLuggageStorage',
        icon: RiLuggageDepositLine,
        label: FACILITY_LABELS.LUGGAGE_STORAGE,
        description: '大型のスーツケースなどを置けるスペースです。',
        iconClassName: 'text-facility-luggage',
    },
    {
        facilityKey: 'hasMultipurposeRoom',
        icon: MdOutlineMeetingRoom,
        label: FACILITY_LABELS.MULTIPURPOSE_ROOM,
        description: '身体の不自由な方、授乳や体調不良のときに使える個室です。',
        iconClassName: 'text-facility-multipurpose',
    },
];
