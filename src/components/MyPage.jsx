import React, {useState, useEffect} from 'react';
import {fetchUserData} from '../api/request'
import { useCookies } from 'react-cookie';
import { useLoggedUser} from '../store/store';
import axiosInstance  from '../api/axiosInstance';


const MyPage = () => {

    const [cookies,] = useCookies(['accessToken']);
    const {userid} = useLoggedUser();
    const [userInfo, setUserInfo] = useState();

    const handleClickDelete = async() => {
        try {
            const response  = await axiosInstance.delete(`/users/${userid}`);
            console.log(response.data);
        }catch(error) {
            console.error('Error deleting user:', error);
        }
    }

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