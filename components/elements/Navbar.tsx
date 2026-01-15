import { NAVIGATION_LINKS } from "@/lib/config";
import NavbarItem from "../bases/NavbarItem";

interface Props {
    currentPath: string;
}

export default function Navbar({ currentPath }: Props) {
    return (
        <nav className="navbar-center hidden lg:flex container">
            <ul className="menu menu-sm menu-horizontal px-1 mx-auto">
                <NavbarItem item={{ href: "/", text: "Home" }} currentPath={currentPath} />
                <NavbarItem item={{ href: "/articles", text: "Articles" }} currentPath={currentPath} />
                {NAVIGATION_LINKS.map((item, index) => (
                    <NavbarItem key={index} item={item} currentPath={currentPath} />
                ))}
            </ul>
        </nav>
    );
}
