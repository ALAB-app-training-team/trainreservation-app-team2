import 'react-credit-cards-2/dist/es/styles-compiled.css';

import Cards, { type Focused } from 'react-credit-cards-2';
import { IoCardOutline, IoMailOutline, IoPersonOutline } from 'react-icons/io5';

import { ReserveUserInfoInput } from '@/features/schedule/components/ReserveUserInfoInput';
import type { ReserveUser } from '@/features/schedule/types/ReserveUser';

type ReserveUserInfoProps = {
    reserveUser: ReserveUser;
    focus: Focused;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputFocus: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getFieldError?: (field: string) => string;
};

export function ReserveUserInfo({
    reserveUser,
    focus,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    getFieldError,
}: ReserveUserInfoProps) {
    const isLoggedIn = !!localStorage.getItem('name');
    return (
        <>
            <div className="border-primary/20 flex flex-col items-start gap-8 border-b-2 py-4">
                {!isLoggedIn && (
                    <div className="flex w-full flex-col gap-4">
                        <h1 className="!mt-0 !mb-0 !text-lg">予約者情報</h1>
                        <ReserveUserInfoInput
                            reserveUser={reserveUser}
                            label="予約者氏名"
                            id="reserverName"
                            type="text"
                            placeholder="山田 太郎"
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            autoComplete="name"
                            icon={IoPersonOutline}
                            getFieldError={getFieldError}
                        />
                        <ReserveUserInfoInput
                            reserveUser={reserveUser}
                            label="メールアドレス"
                            id="reserverMail"
                            type="text"
                            placeholder="demo@example.com"
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            autoComplete="email"
                            icon={IoMailOutline}
                            getFieldError={getFieldError}
                        />
                    </div>
                )}
                <div className="flex w-full flex-col gap-4">
                    <h1 className="!mt-0 !mb-0 !text-lg">
                        クレジットカード情報
                    </h1>
                    <Cards
                        number={reserveUser.cardNumber}
                        expiry={reserveUser.expiry}
                        cvc={reserveUser.cvc}
                        name={reserveUser.cardName}
                        focused={focus}
                    />
                    <ReserveUserInfoInput
                        reserveUser={reserveUser}
                        label="カード番号"
                        id="cardNumber"
                        type="tel"
                        placeholder="4111222233334444"
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        autoComplete="cc-number"
                        icon={IoCardOutline}
                        getFieldError={getFieldError}
                    />
                    <ReserveUserInfoInput
                        reserveUser={reserveUser}
                        label="カード名義人"
                        id="cardName"
                        type="text"
                        placeholder="TARO YAMADA"
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        autoComplete="cc-name"
                        getFieldError={getFieldError}
                    />
                    <ReserveUserInfoInput
                        reserveUser={reserveUser}
                        label="有効期限（月/年）"
                        id="expiry"
                        type="tel"
                        placeholder="MM/YY"
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        autoComplete="cc-exp"
                        getFieldError={getFieldError}
                    />
                    <ReserveUserInfoInput
                        reserveUser={reserveUser}
                        label="セキュリティコード"
                        id="cvc"
                        type="tel"
                        placeholder="123"
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        autoComplete="cc-csc"
                        getFieldError={getFieldError}
                    />
                </div>
            </div>
        </>
    );
}
