import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Search,
  Upload,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Film,
  LogIn
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Browse', path: '/browse' },
  { icon: Upload, label: 'Upload', path: '/upload', requiresAuth: true },
  { icon: User, label: 'Profile', path: '/profile', requiresAuth: true },
  { icon: Settings, label: 'Settings', path: '/settings', requiresAuth: true },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const MenuItem = ({ icon: Icon, label, path, requiresAuth = false }) => {
    if (requiresAuth && !user) return null;

    const isActive = location.pathname === path;
    
    return (
      <Link
        to={path}
        className={cn(
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
          'hover:bg-purple-600/20',
          isActive && 'bg-purple-600 text-white shadow-lg'
        )}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "lg:hidden fixed top-4 z-50 p-2 rounded-lg transition-all duration-300",
          "bg-purple-600 text-white shadow-lg hover:bg-purple-700",
          isOpen ? "left-[240px]" : "left-4"
        )}
      >
        {isOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-gray-800/95 backdrop-blur-lg p-4 z-50',
          'border-r border-purple-500/10',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'shadow-2xl'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 mb-8">
            <div className="p-2 bg-purple-600 rounded-lg shadow-lg">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
              Fozt
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <MenuItem key={item.path} {...item} />
            ))}
          </nav>

          {/* Auth Section */}
          <div className="pt-4 border-t border-purple-500/10">
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors w-full"
              >
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}