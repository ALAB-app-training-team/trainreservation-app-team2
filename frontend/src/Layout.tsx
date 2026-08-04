import { Outlet } from 'react-router-dom';

import { Header } from '@/shared/components/Header';

export function Layout() {
    return (
        <>
            <div className="flex min-h-screen flex-col">
                <div className="sticky top-0 z-50 bg-white">
                    <Header />
                </div>
                <div className="w-full min-w-[375px] flex-1">
                    <Outlet />
                </div>
            </div>
        </>
    );
}
