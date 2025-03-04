import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/';
import { useNavigate } from 'react-router-dom';
import 'Authentication.css';

const AdminLogin = () => {
    const { isDarkMode } = useTheme();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
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
           localStorage.setItem('username', username);
           console.log(response.user)
    
        } catch (error) {
          console.error(error);
          setErrorMessage('Có lỗi xảy ra!');
        }
      };
    
    return (
        <main className="bg-primary text-tertiary">
            <section className='max_padd_container flexCenter flex-col pt-32'>
            <div className='w-[555px] h-[450px] bg-white m-auto px-14 py-10 rounded-md'>
                <h3 className='h3'>Đăng nhập</h3>
                <form onSubmit={handleLogin} className='flex flex-col gap-4 mt-7'>
                <input type="text" placeholder='Tên đăng nhập' className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl' value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder='Mật khẩu' className='h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit' className='btn_dark_rounded my-5 w-full !rounded-md'>Đăng nhập</button>
                <p className='flexCenter text-black font-bold gap-1'>Chưa có tài khoản?<Link to={'/signup'} className={'flex'}><span className='text-secondary underline cursor-pointer'>Đăng ký</span> </Link> </p>
                </form>
                {errorMessage && <p className='flexCenter text-base py-5 text-red-500'>{errorMessage}</p>}
                {successMessage && <p className='text-green-500'>{successMessage}</p>}
            </div>
            </section>
        </main>
    )
}

export default AdminLogin