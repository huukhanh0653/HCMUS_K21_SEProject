import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';

const ForgotPassword = () => {
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(9).fill('')); // Initialize with 9 empty fields
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('email'); // Step can be 'email', 'code', or 'password'
  const [countdown, setCountdown] = useState(60); // Countdown in seconds
  const [isCountdownActive, setIsCountdownActive] = useState(false); // To track if countdown is active

  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isCountdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer); // Clear the interval when the component is unmounted
    };
  }, [isCountdownActive, countdown]);

  const handleEmailSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:4000/user/forgot-password`, { email });
      setMessage(response.data.message);
      /*if (response.status === 200) {
        setStep('code');
        setIsCountdownActive(true); // Start countdown
        setCountdown(60); // Reset countdown
      }*/
    } catch (error: any) {
      setStep('code');
      //setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleCodeChange = (e: any, index: number) => {
    const newCode = [...code];
    newCode[index] = e.target.value.slice(0, 1); // Limit to one character
    setCode(newCode);

    // Automatically focus on the next input field after entering a number
    if (e.target.value !== '' && index < 8) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleCodeSubmit = async (e: any) => {
    e.preventDefault();
    const codeInput = code.join('');
    try {
      const response = await axios.post(`http://localhost:4000/user/verify-code`, { email, code: codeInput });
      setMessage(response.data.message);
      setStep('password');
      /*if (response.status === 200) {
        setStep('password'); // Move to password input step
      }*/
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleClearCode = () => {
    setCode(Array(9).fill(''));
  };

  const handleRetry = async () => {
    // Reset countdown and initiate a new email send request
    setCountdown(60);
    setIsCountdownActive(true);
    try {
      const response = await axios.post(`http://localhost:4000/user/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    const newPassword = e.target[0].value; // Lấy mật khẩu mới từ input
    const confirmPassword = e.target[1].value; // Lấy mật khẩu xác nhận từ input

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      // Gửi yêu cầu API để reset mật khẩu
      const response = await axios.post(`http://localhost:4000/user/reset-password`, {
        email,
        newPassword,
      });

      setMessage(response.data.message);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Update Password Successful!',
          text: 'You can log in now!',
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/auth");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6">
      <div className={`max-w-2xl w-full p-8 rounded-xl shadow-xl ${isDarkMode 
        ? "bg-gradient-to-r from-white to-gray-500" 
        : "bg-gradient-to-r from-blue-500 to-teal-500"
      }`}>
        <h1 className={`text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode
            ? "from-black via-red-900 to-red-800"
            : "from-white via-red-500 to-yellow-400"
            }`}>
          Forgot Password
        </h1>
        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Send Reset Code
            </button>
          </form>
        ) : step === 'code' ? (
          <form onSubmit={handleCodeSubmit}>
            <div className="mb-2 flex justify-between space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(e, index)}
                  className="w-12 h-12 text-center text-black text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 focus:border-indigo-500"
                />
              ))}
            </div>

            {/* Clear All Button */}
            <div className="text-right mb-6">
              <button
                type="button"
                onClick={handleClearCode}
                className={`py-2 text-sm rounded-lg transition duration-300 focus:outline-none ${isDarkMode
                  ? "text-white bg-blue-400 hover:bg-black-100"
                  : "text-indigo-600 hover:bg-indigo-100"
                  }`}
              >
                Clear All
              </button>
            </div>

            {/* Verify Code Button */}
            <div className="flex justify-between mb-4">
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Verify Code
              </button>
            </div>
          </form>
        ) : step === 'password' ? (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Reset Password
            </button>
          </form>
        ) : null}

        {/* Message and Countdown */}
        {message && (
          <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'} font-medium`}>
            {message}
          </p>
        )}

        {/* Countdown and Retry Button */}
        {isCountdownActive && countdown > 0 && step !== 'password' && (
          <p className="mt-4 text-center text-indigo-600 font-medium">
            Time remaining: {countdown}s
          </p>
        )}

        {countdown === 0 && step !== 'password' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleRetry}
              className="py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
