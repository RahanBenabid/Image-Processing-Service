import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../assets/sign_inout/bg1.png';
import robot from '../assets/robot.png';
import { benefits } from '../constants';
import authService from '../services/authService';

const Register = () => {
  const RespRadius = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) {
        return 7; 
      } else if (width < 1024) {
        return 9; 
      } else {
        return 11; 
      }
    }
    return 11;
  };

  const [radius, setRadius] = useState(11);
  useEffect(() => {
    const handleResize = () => {
      setRadius(RespRadius());
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '', 
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.termsAccepted) {
      setError('You must accept the terms and privacy policy.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[90vh] flex flex-col lg:flex-row items-center justify-center lg:justify-around bg-cover -mt-2 bg-center py-10 px-6 lg:px-16 xl:px-24' 
         style={{ backgroundImage: `url(${bgImage})` }}>
      
      <div className='w-full max-w-[450px] p-6 md:p-8 mb-12 lg:mb-0 order-2 lg:order-1'>
         <h1 className='text-3xl md:text-4xl text-white font-bold text-center mb-6'>Register</h1>
         {error && <p className="text-red-500 text-center mb-4">{error}</p>}
         <form onSubmit={handleSubmit}>
            <div className='relative my-6 md:my-8'>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                       className='block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 peer' />
                <label className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                  Full Name
                </label>
            </div>
            <div className='relative my-6 md:my-8'>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                       className='block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 peer' />
                <label className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                  Email Address
                </label>
            </div>
            <div className='relative my-6 md:my-8'>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                       className='block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 peer' />
                <label className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                  Password
                </label>
            </div>
            <div className='relative my-6 md:my-8'>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                       className='block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 peer' />
                <label className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                  Confirm Password
                </label>
            </div>
            <div className='flex items-center mt-4 mb-4'>
                <input type="checkbox" id="terms" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} />
                <label htmlFor="terms" className='text-white text-sm ml-2'>I agree to the Terms and Privacy Policy</label>
            </div>
            <button type='submit' disabled={loading}
                className='w-full text-white py-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 hover:opacity-80 transition duration-300'>
                {loading ? "Registering..." : "Register"}
            </button>
            <div className='text-center mt-6'>
                <span className='text-white text-sm'>Already have an account? <Link to='/login' className='text-blue-500 hover:underline'>Login</Link> </span>
            </div>
        </form>
      </div>
      <div className='relative flex w-[18rem] sm:w-[20rem] lg:w-[22rem] aspect-square border border-n-6 rounded-full mx-auto lg:mx-0 order-1 lg:order-2'>
      
        <div className='flex w-[70%] aspect-square m-auto border border-n-6 rounded-full'>
          <div className='w-[65%] aspect-square m-auto p-[0.2rem] bg-conic-gradient rounded-full'>
            <div className='flex items-center justify-center w-full h-full bg-n-8 rounded-full'>
              <img src={robot} className="w-[75%] h-auto" alt="robot" />
            </div>
          </div>
        </div>

        <ul className="absolute w-full h-full top-0 left-0">
          {benefits.map((item, index) => {
            const angle = index * (360 / benefits.length);
            return (
              <li
                key={item.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-400 hover:scale-110"
                style={{ 
                  left: `calc(59% + ${Math.cos(angle * (Math.PI / 180)) * radius}rem)`,
                  top: `calc(59% + ${Math.sin(angle * (Math.PI / 180)) * radius}rem)`,
                  animation: `float${index} 3s ease-in-out infinite alternate`
                }}
              >
                <div
                  className="flex w-[2.6rem] sm:w-[3.2rem] h-[2.6rem] sm:h-[3.2rem] bg-black/50 backdrop-blur-sm border border-white/20 rounded-full shadow-lg transition-all duration-300 hover:border-blue-400/50 hover:shadow-blue-400/20"
                >
                  <img
                    className="m-auto w-5 h-5 sm:w-6 sm:h-6"
                    alt={item.title}
                    src={item.icon}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <style>
          {benefits.map((item, index) => (`
            @keyframes float${index} {
              0% { transform: translate(-50%, -50%) translateY(0); }
              100% { transform: translate(-50%, -50%) translateY(-5px); }
            }
          `)).join('')}
          {`
            @media (max-width: 640px) {
              .orbit-icon-sm {
                --orbit-radius: 7rem;
              }
            }
            @media (min-width: 641px) and (max-width: 1023px) {
              .orbit-icon-md {
                --orbit-radius: 9rem;
              }
            }
            @media (min-width: 1024px) {
              .orbit-icon-lg {
                --orbit-radius: 11rem;
              }
            }
          `}
        </style>
      </div>
    </div>
  )
}

export default Register;