import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  // baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response: { status } } = error;
    const originalRequest = config;

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = getCookie('refreshToken');
          const res = await axiosInstance.post('/users/token-refresh', { userid: getCookie('userid'), refreshToken });
          const newAccessToken = res.data.accessToken;
          
          // 쿠키에 새로운 액세스 토큰 저장
          document.cookie = `accessToken=${newAccessToken}; path=/`;

          isRefreshing = false;
          onRefreshed(newAccessToken);
          refreshSubscribers = [];
        } catch (err) {
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      const retryOriginalRequest = new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });

      return retryOriginalRequest;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
