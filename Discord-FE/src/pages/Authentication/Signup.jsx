import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTheme } from '../../components/ThemeProvider';
import './Authentication.css';

const Signup = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]+$/.test(phone);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setErrorMessage('Email không hợp lệ');
      return;
    }
    if (!phone || !validatePhone(phone)) {
      setErrorMessage('Số điện thoại không hợp lệ');
      return;
    }
    if (!password) {
      setErrorMessage('Mật khẩu không được để trống');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.message || 'Đăng kí thất bại!');
        return;
      }

      setSuccessMessage('Đăng ký thành công!');
      setTimeout(() => window.location.replace('/login'), 3000);
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra!');
    }
  };

  return (
    <>
      <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Discord</h1>
      <div className={`flex w-[600px] ${isDarkMode ? 'bg-[#2F3136] text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-lg flex-col gap-6 mx-auto mt-20`}> 
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Đăng ký</h2>

        </div>
        
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder='Email' 
            className={`p-3 rounded-md border focus:border-blue-500 outline-none ${isDarkMode ? 'bg-[#202225] text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="tel" 
            placeholder='Số điện thoại' 
            className={`p-3 rounded-md border focus:border-blue-500 outline-none ${isDarkMode ? 'bg-[#202225] text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`} 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
          />
          
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder='Mật khẩu' 
              className={`p-3 w-full rounded-md border focus:border-blue-500 outline-none ${isDarkMode ? 'bg-[#202225] text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder='Xác nhận mật khẩu' 
              className={`p-3 w-full rounded-md border focus:border-blue-500 outline-none ${isDarkMode ? 'bg-[#202225] text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'}`} 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            <button 
              type="button" 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md"
          >
            Tiếp tục
          </button>
        </form>

        {errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p>}
        {successMessage && <p className='text-green-500 text-center'>{successMessage}</p>}

        <p className="text-gray-400 text-sm text-center">
          Đã có tài khoản? 
          <Link to="/login" className="text-blue-400 hover:underline"> Đăng nhập</Link>
        </p>
      </div>
    </>
  );
};

export default Signup;
