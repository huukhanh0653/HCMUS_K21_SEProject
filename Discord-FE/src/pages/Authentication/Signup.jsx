import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import 'Authentication.css';

const Signup = () => {
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]+$/;
    return re.test(String(phone));
  };

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

      const result = await response.json();
      alert(`Đăng kí thành công!`);
      window.location.replace('/login');
      setSuccessMessage(result.message);
      setErrorMessage('');

      // // Delay navigation for a moment to allow users to see the message
      // setTimeout(() => {
      //   // Redirect to login page
      //   window.location.replace('/login');
      // }, 3000); // Delay of 4 seconds 

    } catch (error) {
      console.error(error);
      setErrorMessage('Có lỗi xảy ra!');
    }
  };

  return (
    <main className="bg-primary text-tertiary">
      <section className='max_padd_container flexCenter flex-col pt-32'>
        <div className={`max-w-[555px] h-[600px] m-auto px-14 py-10 rounded-md ${isDarkMode 
        ? "bg-gray-500" 
        : "bg-white "}`}>
        <h2 
          className={`h2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode 
            ? "from-red-400 via-white-500 to-yellow-400" 
            : "from-purple-700 via-blue-500 to-green-400"}
          `}
        >
          Đăng ký
        </h2>
          <form onSubmit={handleSignup} className='flex flex-col gap-4 mt-7'>
            <input type="email" placeholder='Email' className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="tel" placeholder='Số điện thoại' className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl' value={phone} onChange={(e) => setPhone(e.target.value)} />
            
            <div className="relative w-full">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder='Mật khẩu' 
                className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl'
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent p-1 border-none focus:outline-none ${isDarkMode 
                  ? "text-white" 
                  : "text-gray-500"}
                `}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button type='submit' className='btn_dark_rounded my-5 w-full !rounded-md'>Tiếp tục</button>
            
            <p className="flex items-center justify-center text-black font-bold gap-1">
              Đã có tài khoản?
              <Link to="/login" className="text-secondary underline cursor-pointer">
                Đăng nhập
              </Link>
            </p>

          </form>
          {errorMessage && <p className='flexCenter text-base py-5 text-red-500'>{errorMessage}</p>}
          {successMessage && <p className='text-green-500'>{successMessage}</p>}
        </div>
      </section>
    </main>
  )
}

export default Signup