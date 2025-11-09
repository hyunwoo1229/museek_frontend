import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function BoardWrite() {
  const { state } = useLocation();
  const music = state?.music;
  const navigate = useNavigate();

  const [title, setTitle] = useState(music?.title || '');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!music) {
      alert('유효하지 않은 접근입니다. 음악 정보가 없습니다.');
      navigate('/chat');
    }
  }, [music, navigate]);

  if (!music) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // headers 옵션 제거 -> 인터셉터가 자동으로 처리
      await axios.post(
        '/api/board',
        {
          title,
          content,
          musicId: music.id,
        }
      );
      alert('게시글 등록 완료!');
      navigate('/');
    } catch (error) {
      console.error('등록 실패:', error);
      alert('게시글 등록 중 오류 발생');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-12 flex justify-center">
      <div className="w-full max-w-xl bg-gray-800/90 backdrop-blur-md p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-pink-400">게시글 작성</h1>

        {/* 음악 미리보기 */}
        <div className="mb-8 text-center">
          <img src={music.imageUrl} alt="cover" className="w-40 h-40 object-cover mx-auto rounded mb-4" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg overflow-hidden"
          >
            <AudioPlayer
              src={music.audioUrl}
              showJumpControls={false}
              customAdditionalControls={[]}
              layout="horizontal"
              className="w-full rounded-lg bg-gray-900 text-white accent-purple-500"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-300">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="곡에 대한 설명이나 하고 싶은 말을 적어보세요!"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded hover:brightness-110 transition"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default BoardWrite;