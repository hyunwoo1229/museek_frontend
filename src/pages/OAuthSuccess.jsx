import { useEffect } from "react";

const OAuthSuccess = () => {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const name = decodeURIComponent(params.get("name") || "");

    if (accessToken && refreshToken && name) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("name", name);

      window.location.replace("/"); 

    } else {
      alert("로그인 중 문제가 발생했습니다. 토큰 정보가 없습니다.");
      window.location.replace("/");
    }
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#121212] text-white px-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid mb-6" />
      <h2 className="text-2xl font-semibold mb-2">로그인 처리 중입니다...</h2>
      <p className="text-sm text-gray-400">잠시만 기다려 주세요 🔄</p>
    </div>
  );
};

export default OAuthSuccess;