import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ loginId: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1. 로그인 버튼 클릭됨. handleSubmit 함수 시작.");

    try {
        console.log("2. 서버에 로그인 요청 시도. 요청 데이터:", form);

        const res = await axios.post('/api/auth/login', form);

        console.log("3. 서버로부터 응답 받음. 응답 데이터:", res.data);

        const { accessToken, refreshToken, name } = res.data;

        console.log("4. 토큰 저장 시도. accessToken:", accessToken, "refreshToken:", refreshToken);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('name', name);

        console.log("5. 토큰 저장 완료. 메인 페이지로 이동합니다.");

        navigate('/');
    } catch (err) {
        console.error("로그인 프로세스 중 에러 발생:", err);
        alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
};

  return (
    <div className="flex justify-center items-center h-screen bg-[#121212] text-white">
      <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-center mb-6">
          로그인
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
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded hover:brightness-110 transition"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 space-y-2">
          {/* Google */}
          <button
            onClick={() => window.location.href = 'https://museek-backend-976640207402.asia-northeast3.run.app/oauth2/authorization/google'}
            className="w-full bg-white text-black py-2 px-4 rounded flex items-center justify-center gap-2 border"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
            구글로 로그인
          </button>

          {/* Naver */}
        <button
          onClick={() => window.location.href = 'https://museek-backend-976640207402.asia-northeast3.run.app/oauth2/authorization/naver'}
          className="w-full bg-[#03C75A] text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <img src="https://www.svgrepo.com/show/368248/naver-square.svg" alt="Naver" className="w-5 h-5 rounded-sm" />
          네이버로 로그인
        </button>


          {/* Kakao */}
          <button
            onClick={() => window.location.href = 'https://museek-backend-976640207402.asia-northeast3.run.app/oauth2/authorization/kakao'}
            className="w-full bg-[#FEE500] text-black py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" alt="Kakao" className="w-5 h-5" />
            카카오로 로그인
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;