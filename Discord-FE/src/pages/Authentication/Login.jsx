import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTheme } from '../../components/ThemeProvider';
import './Authentication.css';

const Login = () => {
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setErrorMessage('Email không hợp lệ');
      return;
    }

    if (!password) {
      setErrorMessage('Mật khẩu không được để trống');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.message || 'Login failed');
        return;
      }

      window.location.replace('/');
      localStorage.setItem('email', email);
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra!');
    }
  };

  return (
    <>
      <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Discord</h1>

      <div className="flex w-[800px] bg-[#2F3136] p-6 rounded-lg shadow-lg text-white mx-auto mt-20">
        {/* Left Side: Social Login */}
        <div className="w-1/2 flex flex-col justify-center items-center border-r border-gray-700 p-6">
          <h2 className="text-xl font-bold text-center mb-4">Đăng nhập với mạng xã hội</h2>
          
          <button className="flex items-center justify-center gap-3 w-full py-2 bg-white text-gray-800 rounded-md font-semibold shadow-md hover:bg-gray-200">
            <FcGoogle className="text-2xl" />
            Đăng nhập bằng Google
          </button>
        </div>
        
        {/* Right Side: Email/Password Login */}
        <div className="w-1/2 p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Chào mừng trở lại!</h2>
          <p className="text-gray-400 text-center mb-6">Chúng tôi rất vui khi gặp lại bạn!</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder='Email' 
              className='bg-[#202225] text-white p-3 rounded-md border border-gray-700 focus:border-blue-500 outline-none' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder='Mật khẩu' 
                className='bg-[#202225] text-white p-3 w-full rounded-md border border-gray-700 focus:border-blue-500 outline-none' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button 
                type="button" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md"
            >
              Đăng nhập
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-3">
            <Link to="/forgot-password" className="text-blue-400 hover:underline">Quên mật khẩu?</Link>
          </p>

          {errorMessage && <p className='text-red-500 text-center mt-3'>{errorMessage}</p>}
          
          <p className="text-gray-400 text-sm text-center mt-5">
            Chưa có tài khoản? 
            <Link to="/signup" className="text-blue-400 hover:underline"> Đăng ký</Link>
          </p>
        </div>
      </div>
      </>
  );
};

export default Login;