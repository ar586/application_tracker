import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-50 text-gray-900">
            <Navbar />
            <main className="flex-1 w-full flex flex-col p-4 sm:p-6 md:p-8 relative">
                <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col relative h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
