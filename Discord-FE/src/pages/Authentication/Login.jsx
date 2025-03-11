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
      <div className={`w-[400px] h-[260px] m-auto px-14 py-10 rounded-md ${isDarkMode ? "bg-gray-500" : "bg-white "}`}>
          <h2 
            className={`h2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode 
              ? "from-red-400 via-white-500 to-yellow-400" 
              : "from-purple-700 via-blue-500 to-green-400"}
            `}
          >
            Đăng nhập
          </h2>

          {/* Button Container */}
          <div className="flex flex-col w-full gap-4 mt-6">
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
          </div>

          {errorMessage && <p className="text-center text-red-500 mt-4">{errorMessage}</p>}
          {successMessage && <p className="text-center text-green-500 mt-4">{successMessage}</p>}
        </div>
      </section>
    </main>
  );
}

export default Login;
