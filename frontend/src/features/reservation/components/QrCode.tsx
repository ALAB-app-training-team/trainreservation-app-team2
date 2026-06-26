import { QRCodeSVG } from "qrcode.react";

type QrCodeProps = {
  train_car_type_name: string;
  train_car_number: string;
  seat_number: string;
  seat_column: string;
  code_token: string;
  code_token_text: string;
};

export const QrCode = ({
  train_car_type_name,
  train_car_number,
  seat_number,
  seat_column,
  code_token,
  code_token_text,
}: QrCodeProps) => {
  return (
    <div className="max-w-sm mx-auto bg-white border border-primary-light rounded-2xl p-6 shadow-sm text center">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        {train_car_type_name}
      </h2>
      <p className="text-sm text-gray-500 mb-6">{`${train_car_number}号車`}</p>
      <p className="text-sm text-gray-500 mb-6">
        {seat_number}
        {seat_column}
      </p>

      <div className="flex justify-center mb-1">
        <QRCodeSVG
          value={code_token}
          size={180}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"}
          marginSize={4}
          imageSettings={{
            src: "../../../../../public/BsTrainFreightFrontFill.svg",
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>

      <p className="text-sm text-gray-400 mb-4">QRコード: {code_token_text}</p>
    </div>
  );
};
