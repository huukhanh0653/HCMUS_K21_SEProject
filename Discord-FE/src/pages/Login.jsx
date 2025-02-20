import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook } from 'react-icons/fa'; 

const Login = () => {

  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

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
  <main className="bg-primary text-tertiary">
    <section className='max_padd_container flexCenter flex-col pt-32'>
      <div className='w-[555px] h-[500px] bg-white m-auto px-14 py-10 rounded-md'>
        <h3 className='h3 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-blue-500 to-green-400'>
          Đăng nhập
        </h3>
        <form onSubmit={handleLogin} className='flex flex-col gap-4 mt-7 items-center'>
          <input 
            type="text" 
            placeholder='Email' 
            className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl border border-gray-200' 
            value={email} onChange={(e) => setemail(e.target.value)}
          />

          <input 
            type="password" 
            placeholder='Mật khẩu' 
            className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl border border-gray-200' 
            value={password} onChange={(e) => setPassword(e.target.value)} 
          />

          <button 
            type="submit" 
            className="btn_dark_rounded border-gray my-2 w-full rounded-md font-bold 
            bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900"
          >
            Đăng nhập
          </button>

          {/* Google Login Button */}
          <button className="flex items-center justify-center w-80 h-10 bg-white border border-gray-300 rounded-md font-semibold text-gray-700 shadow-md hover:bg-gray-100">
              <FcGoogle className="text-2xl" />
              Đăng nhập bằng Google
            </button>

            {/* Facebook Login Button */}
            <button className="flex items-center justify-center gap-2 w-80 h-10 bg-blue-600 text-white rounded-md font-semibold shadow-md hover:bg-blue-700">
              <FaFacebook className="text-2xl" />
              Đăng nhập bằng Facebook
            </button>

          <p className="flex items-center justify-center text-black font-bold gap-1">
            Chưa có tài khoản?
            <Link to="/signup" className="text-secondary underline cursor-pointer">
              Đăng ký
            </Link>
          </p>

        </form>
        {/* Quên mật khẩu */}
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
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