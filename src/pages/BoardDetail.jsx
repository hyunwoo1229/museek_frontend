import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Pencil, Trash2, Upload } from 'lucide-react';

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`/api/board/${id}`);
        setBoard(response.data);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글을 불러오지 못했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/board/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`/api/board/${id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      alert('게시글이 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 유튜브 업로드 핸들러
  const handleYoutubeUpload = async () => {
    if (!window.confirm('이 음악을 YouTube에 업로드하시겠습니까?')) return;
    if (!accessToken) {
        alert("업로드를 위해서는 먼저 로그인이 필요합니다.");
        navigate('/login');
        return;
    }

    try {
      setUploading(true);

      // 나중에 업로드를 완료하기 위해 현재 게시글 ID를 세션 스토리지에 저장
      sessionStorage.setItem('pendingUploadBoardId', id);

      // 백엔드에 '구글 인증 페이지 URL'을 요청
      const response = await axios.get("/api/youtube/auth-url", {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const googleAuthUrl = response.data;

      // 백엔드로부터 받은 구글 인증 페이지로 사용자를 이동.
      // 이후 과정은 구글 인증 -> 백엔드 콜백 -> /upload-finish 페이지로 자동 진행
      window.location.href = googleAuthUrl;

    } catch (error) {
      alert("YouTube 인증을 시작하는 데 실패했습니다: " + (error.response?.data?.message || error.message));
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#121212] text-white">
        ⏳ 게시글을 불러오는 중...
      </div>
    );
  }

  if (!board) return null;

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {board.title}
            </h2>
            <p className="text-gray-400 text-sm">
              {board.authorName} · {board.createdAt} · 조회수 {board.views}회
            </p>
          </div>

          {board.author === true && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition"
              >
                <Pencil size={16} />
                수정
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition"
              >
                <Trash2 size={16} />
                삭제
              </button>
            </div>
          )}
        </div>

        <div className="w-1/2 aspect-video mx-auto mb-6 overflow-hidden rounded-xl shadow-lg">
          <img
            src={board.imageUrl}
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <AudioPlayer
            src={board.audioUrl}
            showJumpControls={false}
            customAdditionalControls={[]}
            layout="horizontal"
            className="w-full rounded-lg bg-transparent rhap-white-controls"
          />
        </div>

        <p className="text-lg text-white/90 whitespace-pre-line">{board.content || '내용이 없습니다.'}</p>

        {board.author === true && (
          <div className="text-right">
            <button
              onClick={handleYoutubeUpload}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-5 py-3 mt-4 font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={18} />
              {uploading ? '인증 페이지로 이동 중...' : 'YouTube 업로드'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardDetail;