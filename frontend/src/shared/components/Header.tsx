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
            relatedPath: [],
        },
        {
            label: '予約確認',
            to: '/reservationList',
            relatedPath: [],
        },
        ...(!name
            ? [
                  {
                      label: 'ログイン/会員登録',
                      to: '/login',
                      relatedPath: ['/accountCreate'],
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
            <div className="border-primary-light relative flex h-16 items-center justify-start gap-6 border-b-2 px-8 py-2">
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
                <div className="flex flex-1 justify-end px-2">
                    <div className="hidden items-center gap-4 md:flex">
                        {buttons.map((button, index) => (
                            <NavLink
                                key={index}
                                to={button.to}
                                className={({ isActive }) =>
                                    `rounded-xl px-4 py-3 text-sm font-bold ${
                                        isActive
                                            ? 'bg-primary cursor-default text-white'
                                            : button.relatedPath.includes(
                                                    location.pathname,
                                                )
                                              ? 'bg-primary-light cursor-pointer'
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
                                    data-testid="user-name"
                                >
                                    {name}さん
                                    <FiMenu />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="text-primary md:hidden">
                        <button type="button" onClick={handleMenuOpen}>
                            <FiMenu />
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="absolute top-full right-0 z-50 flex w-[120px] flex-col gap-2 rounded-md bg-white p-2 py-2 text-sm font-bold shadow-md">
                    <div className="flex w-full flex-col gap-2 text-left md:hidden">
                        {buttons.map((button, index) => (
                            <NavLink
                                key={index}
                                to={button.to}
                                onClick={handleMenuOpen}
                                className={({ isActive }) =>
                                    `w-full rounded text-left ${
                                        isActive
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                {button.label}
                            </NavLink>
                        ))}
                    </div>
                    {name && (
                        <button
                            onClick={handleLogout}
                            className="w-full text-left hover:bg-gray-100"
                        >
                            ログアウト
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
