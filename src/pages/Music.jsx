import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function Music() {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');
  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 접근 시 로그인 여부 확인
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!taskId) return;
    let intervalId;

    const checkMusicReady = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/suno/music-list?taskId=${taskId}`);
        const completeList = response.data.filter(m => m.audioUrl);

        if (completeList.length >= 2) {
          clearInterval(intervalId);
          setMusicList(completeList);
          setChecking(false);
          setLoading(false);
        } else {
          console.log('🎵 아직 곡이 완성되지 않았습니다...');
        }
      } catch (error) {
        console.error('음악 조회 중 오류 발생:', error);
        // 오류 발생 시 인터벌 중지
        clearInterval(intervalId);
        setChecking(false);
        setLoading(false);
      }
    };

    checkMusicReady();
    intervalId = setInterval(checkMusicReady, 5000);

    return () => clearInterval(intervalId);
  }, [taskId]);

  const handleChoose = (music) => {
    navigate('/board/write', { state: { music } });
  };

  if (!taskId) {
    return <div className="text-center mt-32 text-xl text-white">❌ 유효하지 않은 요청입니다.</div>;
  }

  if (checking) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#121212] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid mb-4"></div>
        <p className="text-lg font-semibold">🎵 곡을 열심히 생성 중입니다...</p>
        <p className="text-sm text-gray-400 mt-2">AI가 음악을 작곡하고 있어요. 잠시만 기다려주세요!</p>
      </div>
    );
  }

  if (loading || musicList.length < 2) {
    return <div className="text-center mt-20 text-xl text-white">❌ 노래가 준비되지 않았습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-pink-400">🎶 생성된 노래를 골라주세요!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {musicList.map((music, idx) => (
          <div key={idx} className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <img src={music.imageUrl} alt="cover" className="w-48 h-48 object-cover rounded mb-4" />
            <div className="w-full" onClick={(e) => e.stopPropagation()}>
              <AudioPlayer
                src={music.audioUrl}
                showJumpControls={false}
                customAdditionalControls={[]}
                layout="horizontal"
                className="rounded-md bg-gray-900 shadow-md mb-2"
              />
            </div>
            <p className="text-white font-semibold mb-2">{music.title}</p>
            <button
              className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded hover:brightness-110 transition"
              onClick={() => handleChoose(music)}
            >
              이 곡 선택하고 게시글 쓰기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Music;