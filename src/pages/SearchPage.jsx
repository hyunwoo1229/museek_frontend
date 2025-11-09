import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import CategoryCarousel from '../components/CategoryCarousel';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // URL의 query 파라미터가 바뀔 때마다 searchTerm도 동기화
  useEffect(() => {
    const q = searchParams.get('query') || '';
    setSearchTerm(q);
  }, [searchParams]);

  // searchTerm이 바뀔 때마다 debounce 후 백엔드 검색 호출
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      const keyword = searchTerm.trim();
      if (keyword === '') {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `/api/board/search?query=${encodeURIComponent(keyword)}`
        );
        setResults(response.data || []);
      } catch (error) {
        console.error('검색 API 호출 실패:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <main className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-6 pb-8">
        {searchTerm.trim() === '' ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl">검색어를 입력하세요.</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="border-4 border-gray-700 border-t-purple-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl">“{searchTerm}”에 해당하는 게시물이 없습니다.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
              “{searchTerm}” 검색 결과
            </h2>
            <CategoryCarousel title="" items={results} basePath="/board" />
          </>
        )}
      </main>
    </div>
  );
}

export default SearchPage;