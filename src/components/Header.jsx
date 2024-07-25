import React, {Fragment} from 'react'
import {Link} from 'react-router-dom';
import {useLoggedState, useLoggedUser} from '../store/store';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";


const Header = () => {

  const {loggedState, setLoggedState} = useLoggedState();
  const {setUser} = useLoggedUser();
  const [ removeCookie] = useCookies(['accessToken', 'refreshToken', 'userid']);

  const navigate = useNavigate();
  
  const handleClickLogout = () => {
      removeCookie('accessToken', { path: '/',  });
      removeCookie('refreshToken', { path: '/',  });
      removeCookie('userid', { path: '/',  });
      setLoggedState(false)
      setUser("");

      alert("로그아웃 되었습니다.");

      navigate("/")
  }


  

  return (
    <div className='header'>
        <h2 className='logo'>
            <Link to="">LOGO</Link>
        </h2>

        <div className='sub_nav'>
          {
            loggedState ? 
            (
              <Fragment>
                <Link to="/mypage" >마이페이지</Link>
                <button onClick={handleClickLogout} >로그아웃</button>
             </Fragment>
            ):
            (
              <Fragment>
                <Link to='/login'>로그인</Link>      
                <Link to='/register'>회원가입</Link>
            </Fragment>
            )
          }  
        </div>
    </div>
  )
}

export default Header