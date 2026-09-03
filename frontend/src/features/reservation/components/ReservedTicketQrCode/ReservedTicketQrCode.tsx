import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { QRCodeSVG } from 'qrcode.react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import trainSvg from '@/shared/svgs/BsTrainFreightFrontFill.svg';

type ReservedTicketQrCodeProps = {
    trainTypeName: string;
    reservedSeats: ReservedSeatDto[];
};

export function ReservedTicketQrCode({
    trainTypeName,
    reservedSeats,
}: ReservedTicketQrCodeProps) {
    const seats = [...reservedSeats].sort(
        (a, b) =>
            a.trainCarNumber - b.trainCarNumber ||
            a.seatNumber - b.seatNumber ||
            a.seatColumn.localeCompare(b.seatColumn),
    );
    return (
        <div className="flex w-full justify-center">
            <Swiper
                spaceBetween={0}
                loop={true}
                pagination={{
                    type: 'fraction',
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="flex w-full max-w-5xl flex-col gap-4"
            >
                {seats.length !== 0 ? (
                    seats.map((reservedSeat) => {
                        return (
                            <div>
                                <SwiperSlide
                                    key={
                                        reservedSeat.trainCarNumber +
                                        reservedSeat.seatNumber +
                                        reservedSeat.seatColumn
                                    }
                                    className="border-primary-light rounded-2xl border-2 p-4"
                                >
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <div>{trainTypeName}</div>
                                            <div className="text-xl font-bold">
                                                {`${reservedSeat.trainCarNumber}号車` +
                                                    `${reservedSeat.seatNumber}番` +
                                                    `${reservedSeat.seatColumn}席`}
                                            </div>
                                        </div>
                                        <div className="mb-1 flex justify-center">
                                            <QRCodeSVG
                                                className="h-auto w-1/4"
                                                value={reservedSeat.codeToken}
                                                size={200}
                                                bgColor={'#ffffff'}
                                                fgColor={'#000000'}
                                                level={'H'}
                                                marginSize={2}
                                                imageSettings={{
                                                    src: trainSvg,
                                                    x: undefined,
                                                    y: undefined,
                                                    height: 40,
                                                    width: 40,
                                                    excavate: true,
                                                }}
                                            />
                                        </div>
                                        <div className="text-sm">
                                            QRコード: {reservedSeat.codeToken}
                                        </div>
                                        {reservedSeat.name ? (
                                            <div className="bg-primary-light text-primary-ink mx-auto mb-4 w-fit rounded-full px-2">
                                                {`${reservedSeat.name} さんに割り当て済み`}
                                            </div>
                                        ) : (
                                            <div className="bg-warning-subtle text-warning mx-auto mb-4 w-fit rounded-full px-2">
                                                同行者が割り当てられていません
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            </div>
                        );
                    })
                ) : (
                    <div>{ERROR_MESSAGE.NO_RESERVED_SEAT}</div>
                )}
            </Swiper>
        </div>
    );
}
