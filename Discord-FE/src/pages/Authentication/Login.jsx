import React from 'react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook } from 'react-icons/fa'; 
import { useTheme } from '../../components/ThemeProvider';
import { signInWithGoogle, signInWithFacebook } from '../../firebase';
import './Authentication.css';

const Login = () => {
  const { isDarkMode } = useTheme();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  return (
  <main className="text-tertiary">
    <section className='max_padd_container flexCenter flex-col pt-32'>
      <div className={`w-[555px] h-[580px] m-auto px-14 py-10 rounded-md ${isDarkMode 
        ? "bg-[#292929]" 
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
              className="flex items-center justify-center w-full h-10 bg-white border border-gray-300 rounded-md font-semibold text-gray-700 shadow-md hover:bg-gray-100"
            >
              <FcGoogle className="text-2xl mr-2" />
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
              className="flex items-center justify-center gap-2 w-full h-10 bg-blue-600 text-white rounded-md font-semibold shadow-md hover:bg-blue-700"
            >
              <FaFacebook className="text-2xl" />
              Đăng nhập bằng Facebook
            </button>

          <p className={`flex items-center justify-center font-bold gap-1${isDarkMode 
              ? "text-[#616A6F]" 
              : "text-black"}
            `}>
            Chưa có tài khoản? &nbsp;

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

export default Login;
