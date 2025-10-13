import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      
      try {
        const res = await axios.get('/api/member/profile');
        setProfile(res.data);
      } catch (error) {
        alert('프로필을 불러오지 못했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.put('/api/member/profile/password', {
        oldPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setEditing(false);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.message || '비밀번호 변경에 실패했습니다.';
      alert(msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        로딩 중…
      </div>
    );
  }
  
  // profile이 아직 null일 경우를 대비한 렌더링 방어 코드
  if (!profile) {
    return null;
  }

  // 이름 이니셜 뽑기 헬퍼
  const getInitials = name =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

  return (
    <div className="min-h-screen bg-[#121212] flex justify-center items-center p-6">
      <div className="bg-gray-800/60 backdrop-blur-md p-8 rounded-2xl w-full max-w-lg shadow-xl border border-gray-700">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-white mb-4 text-center">내 정보</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {getInitials(profile.name)}
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-200">{profile.name}님</p>
        </div>

        {/* Profile Info */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            {
              label: profile.provider === 'form' ? '로그인 ID' : '소셜 로그인',
              value:
                profile.provider === 'form'
                  ? profile.loginId
                  : profile.provider
            },
            { label: '나이', value: `${profile.age}세` },
            { label: '성별', value: profile.gender },
            { label: '국가', value: profile.country }
          ].map(item => (
            <div
              key={item.label}
              className="bg-gray-700/40 hover:bg-gray-700/60 transition p-4 rounded-xl flex flex-col"
            >
              <dt className="text-sm text-gray-300">{item.label}</dt>
              <dd className="mt-1 text-xl font-medium text-white break-all whitespace-normal">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Password Change (폼 로그인일 때만 표시) */}
        {profile.provider === 'form' && (
          <>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-semibold text-white hover:scale-105 transition-transform shadow-md"
              >
                비밀번호 변경
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2 text-gray-200">현재 비밀번호</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-200">새 비밀번호</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-200">비밀번호 확인</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-5 py-2 border border-gray-600 rounded-full text-gray-300 hover:bg-gray-700 transition"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:scale-105 transition-transform shadow-md"
                  >
                    저장
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;