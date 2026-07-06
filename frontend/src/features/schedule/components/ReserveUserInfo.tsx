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
    getFieldError?: (field: string) => string;
};

export function ReserveUserInfo({
    reserveUser,
    focus,
    handleInputChange,
    handleInputFocus,
    getFieldError,
}: ReserveUserInfoProps) {
    return (
        <>
            <div className="flex flex-col items-start gap-4">
                <ReserveUserInfoInput
                    reserveUser={reserveUser}
                    label="購入者氏名"
                    id="name"
                    type="text"
                    placeholder="山田 太郎"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    autoComplete="name"
                    icon={IoPersonOutline}
                    getFieldError={getFieldError}
                />
                <ReserveUserInfoInput
                    reserveUser={reserveUser}
                    label="メールアドレス"
                    id="mail"
                    type="text"
                    placeholder="demo@example.com"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    autoComplete="mail"
                    icon={IoMailOutline}
                    getFieldError={getFieldError}
                />
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
                    autoComplete="off"
                    pattern="[\d]{16,22}"
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
                    autoComplete="off"
                    getFieldError={getFieldError}
                />
                <ReserveUserInfoInput
                    reserveUser={reserveUser}
                    label="有効期限"
                    id="expiry"
                    type="tel"
                    placeholder="12/28"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    autoComplete="off"
                    pattern="\d\d/\d\d"
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
                    autoComplete="off"
                    pattern="\d{3,4}"
                    getFieldError={getFieldError}
                />
            </div>
        </>
    );
}
