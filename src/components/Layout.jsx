import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Music,
  LogOut,
  User,
  LogIn,
  UserPlus,
  PlusCircle,
  Search,
} from 'lucide-react';
import IntroSection from './IntroSection';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState(() => localStorage.getItem('name'));

  useEffect(() => {
    setUserName(localStorage.getItem('name'));
  }, [location.pathname, location.search]);

  const [headerSearch, setHeaderSearch] = useState('');
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('query') || '';
    setHeaderSearch(q);
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('name');
    setUserName(null);
    window.location.href = '/';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = headerSearch.trim();
    navigate(trimmed ? `/search?query=${encodeURIComponent(trimmed)}` : '/search');
  };

  const pathname = location.pathname;
  const hideSongButton = ['/chat', '/music', '/board/write'].some(path =>
    pathname.startsWith(path)
  );

  const isOnMyPage = pathname === '/board/my';
  const profileLabel = isOnMyPage ? '내 정보 보기' : '마이페이지';
  const profilePath  = isOnMyPage ? '/profile'      : '/board/my';

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212] backdrop-blur-md shadow-lg">
        <div className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center gap-2 sm:gap-4 py-3">
          <div
            className="flex items-center gap-2 cursor-pointer ml-2 flex-shrink-0"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Music size={20} className="text-white" />
            </div>
            <span className="text-4xl font-bold">Museek</span>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center flex-1 min-w-0 mx-4 sm:mx-8 max-w-3xl"
          >
            <input
              type="text"
              value={headerSearch}
              onChange={e => setHeaderSearch(e.target.value)}
              placeholder="게시물 제목 검색"
              className="flex-grow bg-[#1c1c1c] border border-gray-600 text-white px-4 py-2.5 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-0"
            />
            <button
              type="submit"
              className="bg-[#1c1c1c] border-t border-b border-r border-gray-600 px-4 py-3 rounded-r-lg hover:bg-gray-600 transition-colors"
              title="검색"
            >
              <Search size={20} className="text-gray-300 hover:text-white" />
            </button>
          </form>

          {/* [수정] ml-auto를 다시 추가하여 오른쪽 정렬 복원 */}
          <div className="flex items-center gap-2 sm:gap-3 flex-nowrap flex-shrink-0 ml-auto">
            {userName ? (
              <>
                {!hideSongButton && (
                  <button
                    onClick={() => navigate('/chat')}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full bg-[#282828] text-white hover:bg-[#383838] transition-all"
                  >
                    <PlusCircle size={16} />
                    <span className="hidden sm:inline">노래 생성하기</span>
                  </button>
                )}

                <button
                  onClick={() => navigate(profilePath)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full bg-[#282828] text-white hover:bg-[#383838] transition-colors"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">{profileLabel}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full bg-[#282828] text-white hover:bg-[#383838] transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">로그아웃</span>
                </button>

                <div className="hidden md:block text-right ml-2">
                  <div className="text-sm text-gray-400">안녕하세요</div>
                  <div className="text-base font-semibold text-white">
                    {userName}님!
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full bg-[#282828] text-white hover:bg-[#383838] transition-all"
                >
                  <LogIn size={16} />
                  <span className="hidden sm:inline">로그인</span>
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full bg-[#282828] text-white hover:bg-[#383838] transition-colors"
                >
                  <UserPlus size={16} />
                  <span className="hidden sm:inline">회원가입</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {location.pathname === '/' && !userName && <IntroSection />}

      <main className="pt-[68px]"> 
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;