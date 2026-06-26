import { Suspense } from "react";
import { SearchScheduleBody } from "../components/SearchScheduleBody/SearchScheduleBody";
import { SearchScheduleBodySkeleton } from "../components/SearchScheduleBody/SearchScheduleBodySkeleton";
import { QrCode } from "../../reservation/components/QrCode";
import { Swiper, SwiperSlide } from "Swiper/react";
import { Pagination, Navigation } from "Swiper/modules";
import "Swiper/css";
import "Swiper/css/pagination";
import "Swiper/css/navigation";

export function SearchSchedule() {
  return (
    <>
      <Suspense fallback={<SearchScheduleBodySkeleton />}>
        <SearchScheduleBody />
        <Swiper
          spaceBetween={20}
          loop={true}
          pagination={{
            type: "fraction",
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="max-w-sm mx-auto text-sm text-gray-500 mb-6 px-12"
        >
          <SwiperSlide>
            <QrCode
              train_car_type_name="はやぶさ40号"
              train_car_number="1"
              seat_number="1"
              seat_column="A"
              code_token="QR-VUEAF6"
              code_token_text="QR-VUEAF6"
            />
          </SwiperSlide>
          <SwiperSlide>
            <QrCode
              train_car_type_name="はやぶさ40号"
              train_car_number="1"
              seat_number="1"
              seat_column="B"
              code_token="QR-VUEAF6"
              code_token_text="QR-VUEAF6"
            />
          </SwiperSlide>
          <SwiperSlide>
            <QrCode
              train_car_type_name="はやぶさ40号"
              train_car_number="1"
              seat_number="1"
              seat_column="C"
              code_token="QR-VUEAF6"
              code_token_text="QR-VUEAF6"
            />
          </SwiperSlide>
        </Swiper>
      </Suspense>
    </>
  );
}
