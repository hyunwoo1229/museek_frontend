import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SimpleCarousel = ({ title, items, basePath }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  if (!items || items.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -340 : 340;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12 relative group">
      <h2 className="text-xl md:text-3xl font-semibold text-white mb-4 px-2">
        {title}
      </h2>

      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-[60%] -translate-y-1/2 -translate-x-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`${basePath}/detail/${item.id}`)}
  
            className="snap-center flex-shrink-0 cursor-pointer group/item w-[90vw] md:w-[320px]"
          >
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-800 relative mb-3 shadow-md">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/0 transition-colors" />
            </div>

            <div className="px-1">
              <h3 className="text-lg font-bold text-white truncate mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {item.authorName} · 조회수 {item.views}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-[60%] -translate-y-1/2 translate-x-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

function BoardList() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const [boards, setBoards] = useState({
    popular: [],
    recent: [],
    age: [],
    country: [],
    gender: [],
    random: []
  });

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) setUserName(storedName);

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/board');
        const data = response.data;
        setBoards({
          popular: data.popularBoards || [],
          recent: data.recentBoards || [],
          age: data.sameAgeBoards || [],
          country: data.sameCountryBoards || [],
          gender: data.sameGenderBoards || [],
          random: data.randomBoards || []
        });
      } catch (error) {
        console.error('게시물 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 min-h-screen bg-[#121212]">
        <div className="border-4 border-gray-700 border-t-purple-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <main className="w-full mx-auto pt-6 pb-8 overflow-hidden">
        
        <SimpleCarousel title="조회순 게시물" items={boards.popular} basePath="/board" />
        <SimpleCarousel title="최신순 게시물" items={boards.recent} basePath="/board" />

        {userName && (
          <>
            <SimpleCarousel title="같은 나이대 게시물" items={boards.age} basePath="/board" />
            <SimpleCarousel title="같은 국가 게시물" items={boards.country} basePath="/board" />
            <SimpleCarousel title="같은 성별 게시물" items={boards.gender} basePath="/board" />
          </>
        )}

        <SimpleCarousel title="랜덤 게시물" items={boards.random} basePath="/board" />

      </main>
    </div>
  );
}

export default BoardList;