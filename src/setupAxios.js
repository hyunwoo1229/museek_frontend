import axios from 'axios';

// axios의 기본 요청 URL을 백엔드 서버로 설정합니다.
axios.defaults.baseURL = 'https://museek-backend-976640207402.asia-northeast3.run.app';

// 백엔드와 쿠키를 주고받기 위해 필수적인 설정입니다.
axios.defaults.withCredentials = true;

// 요청 인터셉터
axios.interceptors.request.use(config => {
  // 토큰 재발급 요청일 경우 헤더에 토큰을 담지 않음
  if (config.url === '/api/auth/reissue') {
    return config;
  }

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


// 응답 인터셉터 (토큰 재발급 로직)
axios.interceptors.response.use(
  res => res,
  async err => {
    const orig = err.config;

    if (err.response?.status === 401 && !orig._retry && orig.url !== '/api/auth/reissue') {
      orig._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post('/api/auth/reissue', { refreshToken });
        
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        orig.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(orig);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('name');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(err);
  }
);

export default axios;