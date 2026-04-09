import { Link } from "react-router-dom";
import { LogOut, Briefcase } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm backdrop-blur-md bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <Briefcase className="h-6 w-6 text-indigo-600" />
                        <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                            AppTracker
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-10 px-4 py-2 space-x-2 text-gray-700"
                            >
                                <span>Logout</span>
                                <LogOut className="h-4 w-4" />
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium hover:text-indigo-600 transition-colors px-4 py-2"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm h-10 px-4 py-2"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
