import { QRCodeSVG } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import type { ReservedSeatDto } from "../../types/ReservedSeatDto";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type ReservedTicketQrCodeProps = {
  train_type_name: string;
  reserved_seats: ReservedSeatDto[];
};

export const ReservedTicketQrCode = ({
  train_type_name,
  reserved_seats,
}: ReservedTicketQrCodeProps) => {
  const trainSvg = "src/shared/svgs/BsTrainFreightFrontFill.svg";
  return (
    <div className="flex justify-center">
      <Swiper
        spaceBetween={0}
        loop={true}
        pagination={{
          type: "fraction",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="w-full max-w-5xl flex flex-col gap-4 m-2"
      >
        {reserved_seats.length !== 0 ? (
          reserved_seats
            .sort(
              (a, b) =>
                a.train_car_number - b.train_car_number ||
                a.seat_number - b.seat_number ||
                a.seat_column.localeCompare(b.seat_column),
            )
            .map((reservedSeat) => {
              return (
                <div>
                  <SwiperSlide
                    key={
                      reservedSeat.train_car_number +
                      reservedSeat.seat_number +
                      reservedSeat.seat_column
                    }
                    className="flex flex-col justify-between border-2 border-primary-light rounded-2xl p-4 gap-2"
                  >
                    <h2>{train_type_name}</h2>
                    <div className="text-sm">
                      {`${reservedSeat.train_car_number}号車` +
                        `${reservedSeat.seat_number}番` +
                        `${reservedSeat.seat_column}席`}
                    </div>
                    <div className="flex justify-center mb-1">
                      <QRCodeSVG
                        className="w-1/4 h-auto"
                        value={reservedSeat.code_token}
                        size={200}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"H"}
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
                    <div className="text-sm mb-4">
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
};
