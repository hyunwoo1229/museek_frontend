import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BoardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`https://museek-backend-976640207402.asia-northeast3.run.app/api/board/${id}`);
        const board = response.data;
        if (!board.author) {
          alert('작성자만 수정할 수 있습니다.');
          navigate(-1);
          return;
        }

        setTitle(board.title);
        setContent(board.content);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글 정보를 불러올 수 없습니다.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();

  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/board/${id}`,
        { title, content }
      );
      alert('수정 완료');
      navigate(`/board/${id}`);
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정 권한이 없거나 오류가 발생했습니다.');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#121212] text-white">
        불러오는 중...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto bg-gray-800/70 p-8 rounded-xl shadow-xl backdrop-blur">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
          게시글 수정
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-300">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-300">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:brightness-110 transition"
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BoardEdit;