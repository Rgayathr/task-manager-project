// Navigation bar component
// Shows app logo, user name, and logout button
// Only visible when user is authenticated
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout - clear auth state and redirect to login
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Don't render navbar if user is not logged in
  if (!user) return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* App logo and name */}
        <h1
          onClick={() => navigate('/')}
          className="text-xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
        >
          ✅ TaskFlow
        </h1>

        {/* User info and logout */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden sm:block">
            Welcome, <span className="text-white font-medium">{user.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
