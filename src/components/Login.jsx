import React, {useState,} from 'react'
import '../css/account.css'
import { FaRegUser } from "react-icons/fa6";
import { IoLockClosedOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import {useLoggedState, useLoggedUser} from '../store/store';
import axiosInstance  from '../api/axiosInstance';


const Login = () => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [cookies, setCookie] = useCookies(['accessToken', 'refreshToken', 'userid']);

  const {setLoggedState} = useLoggedState();
  const {setUser} = useLoggedUser();


  const navigate = useNavigate();

  const navigateRegister = () => {
    navigate("/register")
  }

  const handleChange = (e) => {
    e.preventDefault();

    if(e.target.name === "userId") {
      setUserId(e.target.value);
    }else {
      setUserPw(e.target.value);
    }
  }

  const handleClickLogin = async() => {

    const userInfo = {userid: userId, password: userPw}

    try {
      if(userId && userPw){

        //url에 작성되는 쿼리문은 보안이슈가 있어서 GET 방식을 로그인에서는 사용하지 않는다. 또 한 기록이 캐싱이 되어 기록된 요청정보를 조회할 수 있다.
        //캐싱이 안되고 json정보를 body에 담아 감추어 전달하기 때문에 비교적 보안에 용이하다.
        //로그인은 서버상 로그인 상태를 변경하는것이기 때문에 POST메서드를 이용하는것이 적절하다.

        //withCredentials:  브라우저에서 HTTP 요청을 할 때 쿠키, 인증 헤더 및 TLS 클라이언트 인증 정보를 함께 전송할 수 있도록 설정하는 옵션
        const res = await axiosInstance.post('/users/login', userInfo, { withCredentials: true });

        console.log(res.data); // res.data에서 accessToken에 접근

      
        //서버에 전송한 응답 메세지 츨력
        alert(res.data.message);

        // 토큰을 쿠키에 저장
        /*
            httpOnly: true : 클라이언트 측 자바스크립트 코드에서 쿠키에 접근할 수 없음.
            secure: true: 쿠키는 HTTPS(SSL/TLS) 연결을 통해서만 전송.
            sameSite: 'Strict' : 쿠키가 크로스 사이트 요청과 함께 전송되지 않도록 설정.
        */
          // 쿠키의 유효기간 설정
        const options = { path: '/', maxAge: 3600 }; // 1시간 동안 유효

        setCookie('accessToken', res.data.accessToken, options);
        setCookie('refreshToken', res.data.refreshToken, options);
        setCookie('userid', res.data.userid, options);
        
        setLoggedState(true);
        setUser(res.data.userid);

        navigate('/');

      }else if (!userId){
        alert("아이디를 입력하세요.");
      }else if(!userPw) {
        alert("비밀번호를 입력하세요.");
      }
    }catch (error) {
      if (error.response) {
        // 서버에서 반환된 응답이 있는 경우
        const { status, data } = error.response;
        if (status === 404) {
            alert(data.message || "일치하는 아이디가 없습니다.");
        } else if (status === 401) {
            alert(data.message || "비밀번호가 일치하지 않습니다.");
        } else {
            alert(data.message || "로그인 중 오류가 발생했습니다.");
        }
      }
      console.log(error);
      console.log(3123125435345 );
    }
  }


  return (
    <div className='account_form'>
      <div className='form_box login_form_box'>
        <h2 className='form_tit'>Login</h2>
        <p className='sub_tit'>enter your details to sign in to your account</p>
        <div className='login_input'>
          <div className='input_box'><span className='ico_wrap ico_id'><FaRegUser size="100%" fill="#333"/></span><input type="text" name='userId' onChange={handleChange}/></div>
          <div className='input_box'><span className='ico_wrap ico_pw'><IoLockClosedOutline size="100%" fill="#333"/></span><input type="password" name='userPw' onChange={handleChange}/></div>          
        </div>  
        <button className='btn_account' onClick={handleClickLogin}>Login In</button>
        <p className='new_account'>Don't have an account? <span onClick={navigateRegister}>Signup Now</span></p>
      </div>
    </div>
  )
}

export default Login