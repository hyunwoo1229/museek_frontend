import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';


function MyPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('recent');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("MyPage: useEffect 시작.");

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log("MyPage: 토큰 없음. 로그인 페이지로 이동합니다.");
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    console.log("MyPage: 토큰 발견. 게시물 데이터 요청을 시작합니다.");

    const fetchBoards = async () => {
      try {
        const response = await axios.get('/api/board/my');
        setBoards(response.data || []);

      } catch (error) {
        console.error('MyPage: 게시물 조회 실패. 에러:', error);
        if (error.response?.status !== 401) {
          alert('게시글을 불러오지.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [navigate]);

  // 정렬 로직 (모든 예외 상황 대비)
  const sortedBoards = React.useMemo(() => {
    if (!Array.isArray(boards)) return [];
    
    const copy = [...boards];
    copy.sort((a, b) => {
      if (sortType === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      if (!b.createdAt) return 1;
      if (!a.createdAt) return -1;
      try {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } catch (e) {
        return 0;
      }
    });
    return copy;
  }, [boards, sortType]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#121212] text-white">
        ⏳ 게시글을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
          📁 마이페이지
        </h2>
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setSortType('views')} className={`px-4 py-2 rounded-md font-medium transition-colors ${sortType === 'views' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            조회순 정렬
          </button>
          <button onClick={() => setSortType('recent')} className={`px-4 py-2 rounded-md font-medium transition-colors ${sortType === 'recent' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            최신순 정렬
          </button>
        </div>
        {sortedBoards.length === 0 ? (
          <p className="text-center text-gray-400">작성한 게시글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBoards.map((board) => (
              <div key={board.id} onClick={() => navigate(`/board/${board.id}`)} className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/30 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer">
                <div className="relative overflow-hidden aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10"></div>
                  <img src={board.imageUrl || 'https://placehold.co/600x400/23232D/FFFFFF?text=No+Image'} alt="cover" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"/>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className="text-lg font-bold text-white truncate mb-1">{board.title || '제목 없음'}</h3>
                    <p className="text-sm text-gray-300">{board.authorName || '작성자 미상'}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-400 mb-3">{board.createdAt || '날짜 없음'} • 조회수 {board.views || 0}회</p>
                  <div onClick={(e) => e.stopPropagation()}>
                    <AudioPlayer src={board.audioUrl} showJumpControls={false} customAdditionalControls={[]} layout="horizontal" className="w-full rounded-lg bg-gray-900 text-white accent-purple-500"/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPage;