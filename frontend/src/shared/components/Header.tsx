import { useState } from 'react';
import { BsTrainFreightFrontFill } from 'react-icons/bs';
import { FiMenu } from 'react-icons/fi';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    const buttons = [
        {
            label: '新幹線を探す',
            to: '/scheduleSearch',
        },
        {
            label: '予約確認',
            to: '/reservationList',
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

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        await apiClient.post<string>(ENDPOINTS.LOGOUT());
        localStorage.clear();
        handleMenuOpen();
        navigate('/login');
    };

    return (
        <>
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
                    {name && (
                        <div className="relative">
                            <button
                                onClick={handleMenuOpen}
                                className="flex items-center gap-2 text-sm font-bold"
                            >
                                {name}さん
                                <FiMenu />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isMenuOpen && (
                <div className="absolute top-full right-0 z-10 w-[120px] rounded-md bg-white p-2 text-sm font-bold shadow-md">
                    <button onClick={handleLogout} className="w-full text-left">
                        ログアウト
                    </button>
                </div>
            )}
        </>
    );
}
