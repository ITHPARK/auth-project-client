import axios from 'axios';
import { Cookies } from 'react-cookie';

//리액트 쿠키를 가져온다.
const cookies = new Cookies();

const axiosInstance = axios.create({
  // baseURL: "http://localhost:4000",
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

//토큰 갱신이 완료되었을 때 실행될 콜백 함수들을 저장하는 배열.
let refreshSubscribers = [];

//item이라는 콜백을 배열에 추가한다.
function subscribeTokenRefresh(item) {
  refreshSubscribers.push(item);
}

//배열 각 콜백함수에 인자를 전달한다.
function onRefreshed(token) {
  refreshSubscribers.map((item) => item(token));
}

//특정 쿠키를 가져오는 함수 
function getCookie(name) {
  return cookies.get(name);
}

/*
  HTTP 요청이나 응답을 가로채서 처리할 수 있는 기능을 제공한다.
  인터셉터를 사용하면 요청이 서버로 전달되기 전에 혹은 응답이 애플리케이션에 전달되기 전에 특정 로직을 실행한다
*/


//요청을 보내기 전에 호출되는 인터셉터
axiosInstance.interceptors.request.use(
  //config : 요청의 설정 객체
  (config) => {
    const accessToken = getCookie('accessToken');
    
    if (accessToken) {
      //요청 헤더에 토큰값을 추가
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


//응답 받은 후에 호출되는 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    
    return response;

  },
  async (error) => {

    if (!error.response) {
      // 서버로부터 응답을 받지 못한 경우
      console.error('Network Error or No Response:', error);
      return Promise.reject(error);
    }

    //에러에서 설정과 응답을 추출
    const { config, response: { status } } = error;

    //기존 요청 설정
    const originalRequest = config;


    //엑세스 토큰이 만료되어 HTTP 응답 상태 코드가 401인 경우 토큰을 갱신
    if (status === 401) {
      if (!isRefreshing) {
        //토큰을 갱신중으로 설정
        isRefreshing = true;
        try {
          const refreshToken = getCookie('refreshToken');
          const res = await axiosInstance.post('/users/token', { userid: getCookie('userid'), refreshToken });
          const newAccessToken = res.data.accessToken;
          
          // 쿠키에 새로운 액세스 토큰 저장
          cookies.set('accessToken', newAccessToken, { path: '/' });

          //토큰 갱신 완료
          isRefreshing = false;

          //배열에 
          onRefreshed(newAccessToken);

          refreshSubscribers = [];
        } catch (err) {
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      //promise 객체 토큰이 다시 생성될때까지 기다린다.
      const retryOriginalRequest = new Promise((resolve) => {
        //콜백 함수를 등록
        subscribeTokenRefresh((token) => {

          //헤더에 토큰을 추가함          
          originalRequest.headers.Authorization = `Bearer ${token}`;

          //기존의 요청을 다시 보낸다.
          resolve(axiosInstance(originalRequest));

        });
      });
      return retryOriginalRequest;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
