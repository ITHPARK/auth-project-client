import React, {useState, useEffect} from 'react';
import {fetchUserData} from '../api/request'
import { useCookies } from 'react-cookie';
import {useLoggedUser, useLoggedState} from '../store/store';
import axiosInstance  from '../api/axiosInstance';
import { useNavigate } from "react-router-dom";



const MyPage = () => {

    const {loggedState, setLoggedState} = useLoggedState();
    const {userid, setUser} = useLoggedUser();
    const [userInfo, setUserInfo] = useState();
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken', 'userid']);

    const navigate = useNavigate();

    const handleClickDelete = () => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("회원탈퇴를 하시겠습니까?")) {
            reqDelete();
        }else {
            return false
        }
    }

    const reqDelete = async() => {
        try {
            const response  = await axiosInstance.delete(`/users/${userid}`);
            console.log(response.data);

            const {status} = response;

            if(status === 200) {
                alert("회원탈퇴가 성공하였습니다.");

                removeCookie('accessToken', { path: '/',  });
                removeCookie('refreshToken', { path: '/',  });
                removeCookie('userid', { path: '/',  });
                setLoggedState(false)
                setUser("");
          
                alert("로그아웃 되었습니다.");
          
                navigate("/")
            }
        }catch(error) {
            console.error('Error deleting user:', error);
        }   
    }


    useEffect(() => {
        if(!loggedState) {
            navigate("/");
        }
    },[]);


    useEffect(() => {
        const getUserInfo = async() => {
            if(userid) {
                try {
                    const data = await fetchUserData(userid, cookies.accessToken);
                    console.log(data);        
                    setUserInfo(data);
                }catch (error) {
                    console.log(error);
                }   
            }
        }
        getUserInfo();
        // //로그인된 쿠키와 유저 아이디가 변경되면 컴포넌트 재호출
    }, [cookies.accessToken, userid])

  return (
    <section>
        <div className='my_page'>
            <h2>Profile</h2>
            <div className='info_list'> 
                <div className='info_list_row'>
                    <span>Userid</span>
                    <p>{userInfo?.userid}</p>
                </div>
                <div className='info_list_row'>
                    <span>Username</span>
                    <p>{userInfo?.username}</p>
                </div>
                <div className='info_list_row'>
                    <span>Email</span>
                    <p>{userInfo?.email}</p>
                </div>
            </div>
            <div className='my_page_button_wrap'>   
                <button onClick={handleClickDelete}>회원탈퇴</button>
            </div>
        </div>
    </section>
  )
}

export default MyPage