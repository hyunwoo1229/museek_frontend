import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Chat from './pages/Chat';
import Music from './pages/Music';
import Login from './pages/Login';
import Register from './pages/Register';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
import BoardEdit from './pages/BoardEdit';
import BoardWrite from './pages/BoardWrite';
import MyPage from './pages/MyPage';
import OAuthSuccess from './pages/OAuthSuccess';
import UploadFinish from './pages/UploadFinish';
import SocialExtra from './pages/SocialExtra';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';

import './setupAxios';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  return (
    <Routes>
      {/* ▶ 공통 레이아웃(헤더/푸터)을 적용할 그룹 ▶ */}
      <Route element={<Layout />}>
        {/* 메인 게시판(조회순/최신순 등) */}
        <Route path="/" element={<BoardList />} />

        {/* 게시물 상세, 수정, 작성, 마이페이지 등 */}
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/board/edit/:id" element={<BoardEdit />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/my" element={<MyPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* 채팅, 음악, 업로드 완료 페이지 */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/music" element={<Music />} />
        <Route path="/upload-finish" element={<UploadFinish />} />

        {/* ○○○ 검색 결과 페이지 (이 부분이 핵심) ○○○ */}
        <Route path="/search" element={<SearchPage />} />
      </Route>

      {/* ▶ 로그인/회원가입/소셜로그인 성공 페이지 등 ▶ */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/social-extra" element={<SocialExtra />} />
    </Routes>
  );
}

export default App;
