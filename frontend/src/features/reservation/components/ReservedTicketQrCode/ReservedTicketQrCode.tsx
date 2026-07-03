import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { QRCodeSVG } from 'qrcode.react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
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
            a.train_car_number - b.train_car_number ||
            a.seat_number - b.seat_number ||
            a.seat_column.localeCompare(b.seat_column),
    );
    return (
        <div className="flex justify-center">
            <Swiper
                spaceBetween={0}
                loop={true}
                pagination={{
                    type: 'fraction',
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="m-2 flex w-full max-w-5xl flex-col gap-4"
            >
                {seats.length !== 0 ? (
                    seats.map((reservedSeat) => {
                        return (
                            <div>
                                <SwiperSlide
                                    key={
                                        reservedSeat.train_car_number +
                                        reservedSeat.seat_number +
                                        reservedSeat.seat_column
                                    }
                                    className="border-primary-light flex flex-col justify-between gap-2 rounded-2xl border-2 p-4"
                                >
                                    <h2>{trainTypeName}</h2>
                                    <div className="text-sm">
                                        {`${reservedSeat.train_car_number}号車` +
                                            `${reservedSeat.seat_number}番` +
                                            `${reservedSeat.seat_column}席`}
                                    </div>
                                    <div className="mb-1 flex justify-center">
                                        <QRCodeSVG
                                            className="h-auto w-1/4"
                                            value={reservedSeat.code_token}
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
                                    <div className="mb-4 text-sm">
                                        QRコード: {reservedSeat.code_token}
                                    </div>
                                </SwiperSlide>
                            </div>
                        );
                    })
                ) : (
                    <div>購入済座席が存在しません</div>
                )}
            </Swiper>
        </div>
    );
}
