import { useContext } from 'react';
import { BsTrainFreightFrontFill } from 'react-icons/bs';
import { NavLink, useLocation } from 'react-router-dom';

import { authContext } from '@/context/AuthContext';

export function Header() {
    const location = useLocation();
    const { name } = useContext(authContext);
    const buttons = [
        {
            label: '新幹線を探す',
            to: '/scheduleSearch',
        },
        {
            label: '予約確認',
            to: '/reservationGuestLogin',
        },
        ...(!name
            ? [
                  {
                      label: 'ログイン',
                      to: '/login',
                  },
              ]
            : []),
    ];

    return (
        <div className="border-primary-light relative flex min-h-16 items-center justify-start gap-6 border-b-2 px-8 py-2">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `text-primary flex items-center gap-2 px-4 text-lg font-bold ${
                        isActive || location.pathname === '/scheduleSearch'
                            ? 'cursor-default'
                            : 'cursor-pointer'
                    }`
                }
            >
                <BsTrainFreightFrontFill />
                新幹線でGO！
            </NavLink>
            <div className="flex flex-1 items-center justify-end gap-4 px-4">
                {buttons.map((button, index) => (
                    <NavLink
                        key={index}
                        to={button.to}
                        className={({ isActive }) =>
                            `rounded-xl px-4 py-3 text-sm font-bold ${
                                isActive
                                    ? 'bg-primary cursor-default text-white'
                                    : 'cursor-pointer'
                            }`
                        }
                    >
                        {button.label}
                    </NavLink>
                ))}
                {name && <div className="text-sm font-bold">{name}さん</div>}
            </div>
        </div>
    );
}
