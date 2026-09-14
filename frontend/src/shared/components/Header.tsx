import { useState } from 'react';
import { BsTrainFreightFrontFill } from 'react-icons/bs';
import { FiMenu } from 'react-icons/fi';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import { useOutsideClick } from '@/shared/hooks/useOutsideClick';

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    const buttons = [
        {
            label: '新幹線を探す',
            to: '/scheduleSearch',
            relatedPath: ['/selectSeat'],
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
    const { ref: menuRef } = useOutsideClick(
        () => setIsMenuOpen(false),
        isMenuOpen,
    );
    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        await apiClient.post<string>(ENDPOINTS.LOGOUT());
        localStorage.clear();
        handleMenuOpen();
        navigate('/login');
    };

    const accountMenuItems = [
        ...(role === 'ROLE_ADMIN'
            ? [{ label: 'ユーザー管理', onClick: () => navigate('/admin/password') }]
            : []),
        { label: '予約一覧', onClick: () => navigate('/reservationList') },
        {
            label: '氏名・メールアドレス変更',
            onClick: () => navigate('/accountUpdate'),
        },
        { label: 'パスワード変更', onClick: () => navigate('/passwordUpdate') },
        { label: 'ログアウト', onClick: handleLogout },
    ];

    return (
        <div ref={menuRef}>
            <div className="border-primary-light relative flex h-16 items-center justify-start gap-3 border-b-2 px-4 py-2 md:gap-6 md:px-8">
                <NavLink
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                        `text-primary-ink flex shrink-0 items-center gap-2 px-0 text-lg font-bold md:px-4 ${
                            isActive || location.pathname === '/scheduleSearch'
                                ? 'cursor-default'
                                : 'cursor-pointer'
                        }`
                    }
                >
                    <BsTrainFreightFrontFill />
                    新幹線でGO！
                </NavLink>
                <div className="flex flex-1 items-center justify-end gap-4 px-2">
                    <div className="hidden items-center gap-4 md:flex">
                        {buttons.map((button, index) => (
                            <NavLink
                                key={index}
                                to={button.to}
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `rounded-xl px-4 py-3 text-base font-bold ${
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
                    </div>
                    <button
                        type="button"
                        onClick={handleMenuOpen}
                        className={`flex min-h-11 min-w-11 items-center justify-center gap-2 text-base font-bold ${
                            name ? '' : 'md:hidden'
                        }`}
                    >
                        {name && (
                            <span data-testid="user-name" className="truncate">
                                {name}さん
                            </span>
                        )}
                        <FiMenu className="shrink-0 text-3xl" />
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div
                    className="bg-surface divide-primary absolute top-full right-4 z-50 flex w-[240px] flex-col divide-y rounded-md p-2 py-2 text-base font-bold shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div className="divide-primary flex w-full flex-col divide-y text-left md:hidden">
                        {buttons.map((button, index) => (
                            <NavLink
                                key={index}
                                to={button.to}
                                onClick={handleMenuOpen}
                                className="hover:bg-primary-light min-h-11 w-full px-2 py-2 text-left"
                            >
                                {button.label}
                            </NavLink>
                        ))}
                    </div>
                    {name &&
                        accountMenuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={item.onClick}
                                className="hover:bg-primary-light min-h-11 w-full px-2 py-2 text-left"
                            >
                                {item.label}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}
