import { useFloatRouter } from '@float.js/core';
import MenuIcon from '../../assets/svgs/MenuIcon';
import SearchIcon from '../../assets/svgs/SearchIcon';

export default function TopHeader() {
    const { pathname } = useFloatRouter();

    return (
        <div className="flex items-center justify-between py-6 border-b border-editorial-200 mb-8 container">
            {/* Search Icon */}
            <div className="flex-1">
                <SearchIcon className="w-5 h-5" />
            </div>

            {/* Brand */}
            <div className="flex-1 flex justify-center">
                <a href="/" className="text-3xl font-serif font-bold tracking-tighter">
                    <span className="text-black">Nexo</span>
                    <span className="text-secondary">visión</span>
                </a>
            </div>

            {/* Menu Icon */}
            <div className="flex-1 flex justify-end">
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
