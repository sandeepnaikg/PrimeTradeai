import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckSquare, FiBell, FiLogOut } from 'react-icons/fi';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '../utils/api.js';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [profileName, setProfileName] = useState(user?.name || '');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put('/auth/profile', { name: profileName });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            toast.success('Profile updated successfully');
            setIsProfileDialogOpen(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#f5f7f9]">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#5f7a7a] rounded-lg flex items-center justify-center">
                                <FiCheckSquare className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-800" data-testid="app-title">TaskFlow</h1>
                        </div>

                        <nav className="flex items-center gap-6">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className={`text-sm font-medium transition-colors pb-1 ${isActive('/dashboard')
                                        ? 'text-gray-800 border-b-2 border-gray-800'
                                        : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                Workspace
                            </button>
                            <button
                                onClick={() => navigate('/analytics')}
                                className={`text-sm font-medium transition-colors pb-1 ${isActive('/analytics')
                                        ? 'text-gray-800 border-b-2 border-gray-800'
                                        : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                Analytics
                            </button>
                            <button
                                onClick={() => navigate('/documentation')}
                                className={`text-sm font-medium transition-colors pb-1 ${isActive('/documentation')
                                        ? 'text-gray-800 border-b-2 border-gray-800'
                                        : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                Documentation
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <FiBell className="h-5 w-5 text-gray-600" />
                        </button>

                        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                            <DialogTrigger asChild>
                                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors" data-testid="profile-button">
                                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                                        <span className="text-xs font-semibold text-orange-600">{user?.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent data-testid="profile-dialog" className="bg-white">
                                <DialogHeader>
                                    <DialogTitle>Profile Settings</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="profileName">Name</Label>
                                        <Input
                                            id="profileName"
                                            value={profileName}
                                            onChange={(e) => setProfileName(e.target.value)}
                                            data-testid="profile-name-input"
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={user?.email} disabled data-testid="profile-email-display" className="h-10" />
                                    </div>
                                    <Button type="submit" className="w-full bg-[#5f7a7a] hover:bg-[#4d6262]" data-testid="profile-save-button">
                                        Save Changes
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-800" data-testid="logout-button">
                            <FiLogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
