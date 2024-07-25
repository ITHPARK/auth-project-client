import './css/reset.css';
import './css/common.css';
import { useEffect} from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import MyPage from './components/MyPage';
import { useCookies } from 'react-cookie';
import {useLoggedState, useLoggedUser} from './store/store';
import useRefreshToken from './hooks/useRefreshToken';


const DefaultLayout = () => {
  return (
    <>
      <Header />

      <Outlet />
    </>
  );
}

function App() {
  const [cookies] = useCookies(['accessToken', 'refreshToken', 'userid']);
  const {setLoggedState} = useLoggedState();
  const {setUser} = useLoggedUser();
  const refresh = useRefreshToken();

  
  useEffect(() => {
    //로그아웃을 눌러도 브라우저에서 쿠키 삭제를 하지 않고 있음.
    
    if (cookies.accessToken) {
      setLoggedState(true);
      setUser(cookies.userid);
    } else {
      if(!cookies.accessToken && cookies.refreshToken) {
        refresh();
      }else {
        setLoggedState(false);
      }
    }
  }, [cookies.accessToken, cookies.refreshToken, cookies.userid, setLoggedState, setUser]);
  

  return (
    <Routes>
      <Route path='/' element={<DefaultLayout />}>
        <Route index element={<MainPage/>}/> 
        <Route path='/mypage' element={<MyPage/>} />
      </Route>
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register />} />
    </Routes>
  );
}

export default App;