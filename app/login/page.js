'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient',
    full_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Kiểm tra user trong database
      const { data: users, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .eq('password_hash', formData.password)
        .single();

      if (queryError || !users) {
        setError('Email hoặc mật khẩu không đúng!');
        setLoading(false);
        return;
      }

      // Lưu thông tin user vào localStorage
      localStorage.setItem('user', JSON.stringify(users));

      // Chuyển hướng theo role
      if (users.role === 'patient') {
        router.push('/patient/dashboard');
      } else if (users.role === 'doctor') {
        router.push('/doctor/dashboard');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Kiểm tra email đã tồn tại chưa
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        setError('Email này đã được sử dụng!');
        setLoading(false);
        return;
      }

      // Tạo user mới
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([
          {
            email: formData.email,
            password_hash: formData.password,
            role: formData.role,
          },
        ])
        .select()
        .single();

      if (userError) {
        setError('Không thể tạo tài khoản. Vui lòng thử lại!');
        setLoading(false);
        return;
      }

      // Tạo profile tương ứng
      if (formData.role === 'patient') {
        await supabase.from('patients').insert([
          {
            user_id: newUser.user_id,
            full_name: formData.full_name,
            phone: formData.phone,
          },
        ]);
      } else if (formData.role === 'doctor') {
        await supabase.from('doctors').insert([
          {
            user_id: newUser.user_id,
            full_name: formData.full_name,
            phone: formData.phone,
          },
        ]);
      }

      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setIsLogin(true);
      setFormData({
        email: '',
        password: '',
        role: 'patient',
        full_name: '',
        phone: '',
      });
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </h1>
          <p className="text-gray-500 text-sm">Hệ thống quản lý lịch hẹn y tế</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r mb-4 animate-shake">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium text-sm">Email (Username)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium text-sm">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Vai trò</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="patient">Bệnh nhân</option>
                  <option value="doctor">Bác sĩ</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc</span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium transition duration-200 hover:underline"
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}
