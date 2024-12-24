import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/Button';
import { Film, Home, Search, User, Upload } from 'lucide-react';

export function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-purple-500" />
              <span className="text-xl font-bold">Fozt</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-300 hover:text-white"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/browse"
                className="flex items-center space-x-1 text-gray-300 hover:text-white"
              >
                <Search className="w-4 h-4" />
                <span>Browse</span>
              </Link>
              {user && (
                <Link
                  to="/upload"
                  className="flex items-center space-x-1 text-gray-300 hover:text-white"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button variant="secondary" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}