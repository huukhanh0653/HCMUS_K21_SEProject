import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/ThemeProvider';
import './Authentication.css';

const Signup = () => {
  const { isDarkMode } = useTheme();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateUsername = (username) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(username).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]+$/;
    return re.test(String(phone));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !validateUsername(username)) {
      setErrorMessage('Username không hợp lệ');
      return;
    }

    if (!phone || !validatePhone(phone)) {
      setErrorMessage('Số điện thoại không hợp lệ');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.message || 'Đăng ký thất bại!');
        return;
      }

      const result = await response.json();
      alert(`Đăng ký thành công!`);
      navigate('/login');
      setSuccessMessage(result.message);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Có lỗi xảy ra!');
    }
  };

  return (
    <main className="text-tertiary auth-container">
      <section className='max_padd_container flexCenter flex-col pt-32'>
        <div className={`max-w-[555px] m-auto px-14 py-10 rounded-md ${isDarkMode ? "bg-gray-500" : "bg-white "}`}>
          <h2 className={`h2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? "from-red-400 via-white-500 to-yellow-400" : "from-purple-700 via-blue-500 to-green-400"}`}>
            Điền thông tin đăng ký
          </h2>
          <form onSubmit={handleSignup} className='flex flex-col gap-4 mt-7'>
            <input type="text" placeholder='Username' className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl' value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="tel" placeholder='Số điện thoại' className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl' value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button type='submit' className='btn_dark_rounded my-5 w-full !rounded-md'>Tiếp tục</button>
            <p className="flex items-center justify-center text-black font-bold gap-1">
              Đã có tài khoản?
              <Link to="/login" className={`text-secondary underline cursor-pointer ${isDarkMode ? "text-white" : "text-blue-800"}`}>
                Đăng nhập
              </Link>
            </p>
          </form>
          {errorMessage && <p className='flexCenter text-base py-5 text-red-500'>{errorMessage}</p>}
          {successMessage && <p className='text-green-500'>{successMessage}</p>}
        </div>
      </section>
    </main>
  );
};

export default Signup;
