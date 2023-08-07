import HeaderNav from "@/layout/Guest/HeaderNav/HeaderNav";
import {ReactNode} from "react";

type GuestLayoutProps = {
    children: ReactNode
}

const GuestLayout = ({children}: GuestLayoutProps) => {
    return (
        <div>
            <HeaderNav/>
            {children}
        </div>
    );
};

export default GuestLayout;
