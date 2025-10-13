import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

const CategoryCarousel = ({ title, items, basePath }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  // 한 번 버튼을 누를 때마다 컨테이너가 이동할 픽셀 값
  const SCROLL_OFFSET = 800;

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: -SCROLL_OFFSET,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: SCROLL_OFFSET,
      behavior: 'smooth',
    });
  };

  // 빈 배열이거나 items가 없으면 아무것도 렌더링하지 않음
  if (!items || items.length === 0) return null;

  return (
    <section className="relative group mt-4">
      {/* 왼쪽 버튼 */}
      <button
        onClick={scrollLeft}
        className={`
          absolute top-1/2 -translate-y-1/2 left-0 z-20 p-2 bg-black/50 rounded-full
          opacity-0 group-hover:opacity-100 transition-opacity
        `}
      >
        <ChevronLeftIcon className="h-6 w-6 text-white" />
      </button>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-hidden scrollbar-hide"
      >
        {items.map((board) => (
          <div
            key={board.id}
            onClick={() => navigate(`${basePath}/${board.id}`)}
            className="min-w-[380px] cursor-pointer group-hover:opacity-90 transition-opacity"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <img
                src={board.imageUrl}
                alt={board.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="mt-2 px-1">
              <h3 className="text-lg font-semibold text-white truncate">
                {board.title}
              </h3>
              <p className="text-sm text-gray-300 truncate">
                작성자: {board.authorName}
              </p>
              <p className="text-xs text-gray-500">
                조회수: {board.views}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 버튼 */}
      <button
        onClick={scrollRight}
        className={`
          absolute top-1/2 -translate-y-1/2 right-0 z-20 p-2 bg-black/50 rounded-full
          opacity-0 group-hover:opacity-100 transition-opacity
        `}
      >
        <ChevronRightIcon className="h-6 w-6 text-white" />
      </button>
    </section>
  );
};

export default CategoryCarousel;
