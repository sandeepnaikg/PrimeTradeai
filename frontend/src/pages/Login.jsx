import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '../utils/api';
import { FiLogIn, FiCheckCircle } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Logo */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-black" data-testid="login-heading">
              TaskFlow
            </h1>
            <p className="text-black/60 text-lg">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            data-testid="login-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-black">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`h-14 input-white text-black text-base ${errors.email ? 'border-red-500' : ''}`}
                data-testid="login-email-input"
              />
              {errors.email && (
                <p className="text-sm text-red-600" data-testid="email-error">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-black">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`h-14 input-white text-black text-base ${errors.password ? 'border-red-500' : ''}`}
                data-testid="login-password-input"
              />
              {errors.password && (
                <p className="text-sm text-red-600" data-testid="password-error">{errors.password}</p>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                className="w-full h-14 btn-white text-base font-semibold rounded-2xl flex items-center justify-center gap-2"
                disabled={loading}
                data-testid="login-submit-button"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <FiLogIn className="h-5 w-5" />
                    Sign in
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Sign Up Link */}
          <div className="text-center text-sm pt-4">
            <span className="text-black/60">Don't have an account? </span>
            <Link to="/register" className="text-black hover:underline font-semibold" data-testid="register-link">
              Create one now
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;