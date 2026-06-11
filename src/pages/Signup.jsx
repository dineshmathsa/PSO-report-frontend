import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { BarChart3, User, Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const Signup = () => {
  const { signup, token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Name is required';
    }
    
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address';
    }
    
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Confirmation is required';
    } else if (confirmPassword !== password) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setApiSuccess(false);

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await signup(name.trim(), email, password);
    setIsSubmitting(false);

    if (result.success) {
      setApiSuccess(true);
      // Wait a moment so user can read success feedback, then redirect
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0f19] px-4 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-indigo-600/10 blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] rounded-full bg-emerald-600/10 blur-[100px] translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* App Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1.5">Sign up to generate analytics and reports</p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Success Alert */}
        {apiSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>Registration successful! Redirecting to login...</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="John Doe"
                className={`w-full bg-slate-950/60 border ${
                  errors.name ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } rounded-xl py-2.5 pl-11 pr-4 text-slate-100 placeholder-slate-600 text-sm outline-none transition-all duration-200`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-400 font-medium">{errors.name}</p>}
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="exec@company.com"
                className={`w-full bg-slate-950/60 border ${
                  errors.email ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } rounded-xl py-2.5 pl-11 pr-4 text-slate-100 placeholder-slate-600 text-sm outline-none transition-all duration-200`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-400 font-medium">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="••••••••"
                className={`w-full bg-slate-950/60 border ${
                  errors.password ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } rounded-xl py-2.5 pl-11 pr-4 text-slate-100 placeholder-slate-600 text-sm outline-none transition-all duration-200`}
              />
            </div>
            {errors.password && <p className="text-xs text-rose-400 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                placeholder="••••••••"
                className={`w-full bg-slate-950/60 border ${
                  errors.confirmPassword ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } rounded-xl py-2.5 pl-11 pr-4 text-slate-100 placeholder-slate-600 text-sm outline-none transition-all duration-200`}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-rose-400 font-medium">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || apiSuccess}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:scale-[1.01] mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
