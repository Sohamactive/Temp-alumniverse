import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, User, Mail, Lock } from 'lucide-react';
import { BASE_URL } from "../api";

const AuthPage = ({ onLogin }) => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    const config = { headers: { 'Content-Type': 'application/json' } };

    if (isLoginView) {
      try {
        const body = { email, password, role };
        const res = await axios.post(`${BASE_URL}/auth/login`, body, config);
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.name);
        localStorage.setItem('userRole', res.data.role);
        localStorage.setItem('userId', res.data._id);

        onLogin(res.data.role, res.data.name);
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      }
    } else {
      try {
        const body = { name, email, password, role };
        const res = await axios.post(`${BASE_URL}/auth/register`, body, config);

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userName', res.data.name);
        localStorage.setItem('userRole', res.data.role);
        localStorage.setItem('userId', res.data._id);
        localStorage.setItem('userProfilePicture', res.data.profilePicture || "");

        navigate(`/onboarding/${role}`);
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  const title = isLoginView ? 'Login' : 'Sign Up';
  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

  // Background style (same as Landing Page)
  const backgroundStyle = {
    backgroundImage: 'url("/background.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-start p-6 md:pl-[10%] lg:pl-[15%]" 
      style={backgroundStyle}
    >
      {/* Glassmorphism Card */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md transition-all duration-300">
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
            {roleDisplay} {title}
          </h1>
          <p className="text-gray-800 text-sm font-medium opacity-80">
            Welcome back! Please enter your details.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-900 text-sm font-medium text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLoginView && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={name}
                onChange={onChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500 text-gray-900"
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500 text-gray-900"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500 text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center group"
          >
            {title} 
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </form>

        <p className="text-center text-sm text-gray-800 mt-8 font-medium">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
            }}
            className="font-bold text-blue-700 hover:underline ml-2 transition-all"
          >
            {isLoginView ? 'Sign Up' : 'Login'}
          </button>
        </p>

        <footer className="mt-8 text-center">
            <button 
                onClick={() => navigate('/landing')}
                className="text-xs text-gray-700 font-bold uppercase tracking-widest hover:text-gray-900 opacity-60 hover:opacity-100 transition-opacity"
            >
                ← Back to Home
            </button>
        </footer>
      </div>
    </div>
  );
};

export default AuthPage;