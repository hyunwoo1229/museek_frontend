import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const countries = ["대한민국", "미국", "일본", "영국", "프랑스", "독일", "캐나다", "중국", "호주", "인도"];
const genders = ["남성", "여성"];
const ages = Array.from({ length: 101 }, (_, i) => i);

const Register = () => {
  const [form, setForm] = useState({
    loginId: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    gender: '',
    country: ''
  });

  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/member/register', {
        loginId: form.loginId,
        password: form.password,
        name: form.name,
        age: form.age,
        gender: form.gender,
        country: form.country
      });
      alert('회원가입 성공!');
      navigate('/login');
    } catch (err) {
      alert('회원가입 실패: ' + (err.response?.data?.message || '서버 오류'));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#121212] text-white">
      <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-center mb-6">
          회원가입
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">아이디(이메일)</label>
            <input
              type="text"
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="아이디 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="비밀번호 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full bg-gray-700 border ${passwordError ? 'border-red-500' : 'border-gray-600'} text-white px-3 py-2 rounded focus:outline-none ${passwordError ? 'focus:ring-2 focus:ring-red-500' : 'focus:ring-2 focus:ring-purple-500'}`}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="이름 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">나이</label>
            <select
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
              required
            >
              <option value="">나이 선택</option>
              {ages.map(age => (
                <option key={age} value={age}>{age}세</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">성별</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
              required
            >
              <option value="">성별 선택</option>
              {genders.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">국가</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
              required
            >
              <option value="">국가 선택</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded hover:brightness-110 transition"
          >
            회원가입
          </button>
        </form>

        <div className="mt-6 space-y-2">
          {/* Google */}
          <button
            onClick={() => (window.location.href = 'http://localhost:8080/oauth2/authorization/google')}
            className="w-full bg-white text-black py-2 px-4 rounded flex items-center justify-center gap-2 border"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
            구글로 시작하기
          </button>

          {/* Naver */}
          <button
            onClick={() => (window.location.href = 'http://localhost:8080/oauth2/authorization/naver')}
            className="w-full bg-[#03C75A] text-white py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <img src="https://www.svgrepo.com/show/368248/naver-square.svg" alt="Naver" className="w-5 h-5 rounded-sm" />
            네이버로 시작하기
          </button>

          {/* Kakao */}
          <button
            onClick={() => (window.location.href = 'http://localhost:8080/oauth2/authorization/kakao')}
            className="w-full bg-[#FEE500] text-black py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" alt="Kakao" className="w-5 h-5" />
            카카오로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;