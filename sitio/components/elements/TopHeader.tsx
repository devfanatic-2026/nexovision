import { useFloatRouter } from '@float.js/core';
import MenuIcon from '../../assets/svgs/MenuIcon';
import SearchIcon from '../../assets/svgs/SearchIcon';

export default function TopHeader() {
    const { pathname } = useFloatRouter();

    return (
        <div className="flex items-center justify-between py-6 container relative">
            {/* Branding - Always Centered */}
            <div className="flex-1 flex justify-center">
                <a href="/" className="text-3xl font-serif font-bold tracking-tighter">
                    <span className="text-black">Nexo</span>
                    <span className="text-secondary">visión</span>
                </a>
            </div>

            {/* Menu Icon - Mobile Only and positioned to the left */}
            <div className="absolute left-4 md:hidden">
                <a
                    href={`/mobile/menu?returnUrl=${encodeURIComponent(pathname || '/')}`}
                    aria-label="Menu"
                >
                    <MenuIcon className="w-6 h-6" />
                </a>
            </div>
        </div>
    );
}
