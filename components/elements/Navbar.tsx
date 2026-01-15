import { NAVIGATION_LINKS } from "@/lib/config";
import NavbarItem from "../bases/NavbarItem";

interface Props {
    currentPath: string;
}

export default function Navbar({ currentPath }: Props) {
    return (
        <nav className="navbar-center hidden lg:flex container">
            <ul className="menu menu-horizontal px-1 mx-auto gap-4 font-sans font-medium uppercase tracking-widest text-xs">
                <NavbarItem item={{ href: "/", text: "Inicio" }} currentPath={currentPath} />
                <NavbarItem item={{ href: "/articles", text: "Artículos" }} currentPath={currentPath} />
                {NAVIGATION_LINKS.map((item, index) => (
                    <NavbarItem key={index} item={item} currentPath={currentPath} />
                ))}
            </ul>
        </nav>
    );
}
