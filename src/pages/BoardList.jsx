import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CategoryCarousel from '../components/CategoryCarousel';

function BoardList() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const [popularBoards, setPopularBoards]          = useState([]);
  const [recentBoards, setRecentBoards]            = useState([]);
  const [sameAgeBoards, setSameAgeBoards]          = useState([]);
  const [sameCountryBoards, setSameCountryBoards] = useState([]);
  const [sameGenderBoards, setSameGenderBoards]    = useState([]);
  const [randomBoards, setRandomBoards]            = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUserName(storedName);
    }

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          '/api/board'
        );
        const data = response.data;
        setPopularBoards(data.popularBoards || []);
        setRecentBoards(data.recentBoards || []);
        setSameAgeBoards(data.sameAgeBoards || []);
        setSameCountryBoards(data.sameCountryBoards || []);
        setSameGenderBoards(data.sameGenderBoards || []);
        setRandomBoards(data.randomBoards || []);
      } catch (error) {
        console.error('카테고리별 게시물 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="border-4 border-gray-700 border-t-purple-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <main className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-6 pb-8">

        {/* 1) 조회순 게시물 */}
        {popularBoards.length > 0 && (
          <>
            <h2 className="text-3xl font-semibold text-white mb-4">
              조회순 게시물
            </h2>
            <CategoryCarousel items={popularBoards} basePath="/board" />
          </>
        )}

        {/* 2) 최신순 게시물 */}
        {recentBoards.length > 0 && (
          <>
            <h2 className="text-3xl font-semibold text-white mt-12 mb-4">
              최신순 게시물
            </h2>
            <CategoryCarousel items={recentBoards} basePath="/board" />
          </>
        )}

        {/* 3~5) 로그인한 사용자만 */}
        {userName && (
          <>
            {sameAgeBoards.length > 0 && (
              <>
                <h2 className="text-3xl font-semibold text-white mt-12 mb-4">
                  같은 나이대 게시물
                </h2>
                <CategoryCarousel items={sameAgeBoards} basePath="/board" />
              </>
            )}
            {sameCountryBoards.length > 0 && (
              <>
                <h2 className="text-3xl font-semibold text-white mt-12 mb-4">
                  같은 국가 게시물
                </h2>
                <CategoryCarousel items={sameCountryBoards} basePath="/board" />
              </>
            )}
            {sameGenderBoards.length > 0 && (
              <>
                <h2 className="text-3xl font-semibold text-white mt-12 mb-4">
                  같은 성별 게시물
                </h2>
                <CategoryCarousel items={sameGenderBoards} basePath="/board" />
              </>
            )}
          </>
        )}

        {/* 6) 랜덤 게시물 (맨 아래) */}
        {randomBoards.length > 0 && (
          <>
            <h2 className="text-3xl font-semibold text-white mt-12 mb-4">
              랜덤 게시물
            </h2>
            <CategoryCarousel items={randomBoards} basePath="/board" />
          </>
        )}

      </main>
    </div>
  );
}

export default BoardList;