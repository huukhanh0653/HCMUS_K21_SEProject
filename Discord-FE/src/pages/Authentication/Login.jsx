import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook } from 'react-icons/fa'; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from '../../components/ThemeProvider';
import { signInWithGoogle, signInWithFacebook } from '../../firebase';
import './Authentication.css';

const Login = () => {
  const { isDarkMode } = useTheme();

  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

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

      const result = await response.json();
      setSuccessMessage(result.message);
      setErrorMessage('');

      // Redirect to the homepage
       window.location.replace("/");
       localStorage.setItem('email', email);
       console.log(response.user)

    } catch (error) {
      console.error(error);
      setErrorMessage('Có lỗi xảy ra!');
    }
  };
  
  return (
  <main className="text-tertiary">
    <section className='max_padd_container flexCenter flex-col pt-32'>
      <div className={`w-[555px] h-[580px] m-auto px-14 py-10 rounded-md ${isDarkMode 
        ? "bg-gray-500" 
        : "bg-white "}`}
      >
        <h2 
          className={`h2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode 
            ? "from-red-400 via-white-500 to-yellow-400" 
            : "from-purple-700 via-blue-500 to-green-400"}
          `}
        >
          Đăng nhập
        </h2>
        <form onSubmit={handleLogin} className='flex flex-col gap-4 mt-7 items-center'>
          <input 
            type="text" 
            placeholder='Email' 
            className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl border border-gray-200' 
            value={email} onChange={(e) => setemail(e.target.value)}
          />

          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder='Mật khẩu' 
              className='h-14 w-full pl-5 pr-12 bg-slate-900/5 outline-none rounded-xl border border-gray-200' 
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


          <button 
            type="submit" 
            className="btn_dark_rounded border-gray my-2 w-full rounded-md font-bold 
            bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900"
          >
            Đăng nhập
          </button>

          {/* Google Login Button */}
          <button 
  onClick={async () => {
    try {
      const user = await signInWithGoogle();
      localStorage.setItem('email', user.email);
      window.location.replace("/");
    } catch (error) {
      console.error(error);
      setErrorMessage("Google đăng nhập thất bại");
    }
  }}
  className="flex items-center justify-center w-80 h-10 bg-white border border-gray-300 rounded-md font-semibold text-gray-700 shadow-md hover:bg-gray-100"
>
  <FcGoogle className="text-2xl" />
  Đăng nhập bằng Google
</button>

<button 
  onClick={async () => {
    try {
      const user = await signInWithFacebook();
      localStorage.setItem('email', user.email);
      window.location.replace("/");
    } catch (error) {
      console.error(error);
      setErrorMessage("Facebook đăng nhập thất bại");
    }
  }}
  className="flex items-center justify-center gap-2 w-80 h-10 bg-blue-600 text-white rounded-md font-semibold shadow-md hover:bg-blue-700"
>
  <FaFacebook className="text-2xl" />
  Đăng nhập bằng Facebook
</button>


          <p className="flex items-center justify-center text-black font-bold gap-1">
            Chưa có tài khoản?
            <Link to="/signup" className={`text-secondary underline cursor-pointer ${isDarkMode 
              ? "text-white" 
              : "text-blue-800"}
            `}>
              Đăng ký
            </Link>
          </p>

        </form>
        {/* Quên mật khẩu */}
        <div className="flex justify-end">
          <Link to="/forgot-password" 
            className={`text-sm hover:underline" ${isDarkMode 
              ? "text-red-600 font-bold hover:text-white" 
              : "text-red-500 hover:text-red-900"}
            `}
          >
            Quên mật khẩu?
          </Link>
        </div>
        {errorMessage && <p className='flexCenter text-base py-5 text-red-500'>{errorMessage}</p>}
        {successMessage && <p className='text-green-500'>{successMessage}</p>}
      </div>
    </section>
  </main>
  )
}

export default Login