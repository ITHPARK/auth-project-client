import { useCookies } from 'react-cookie';
import axiosInstance  from '../api/axiosInstance';

const useRefreshToken = () => {
    const [cookies, setCookie] = useCookies(['accessToken', 'refreshToken', 'userid'])
    

    const refresh = async() => {
        const userid = cookies.userid;
        const refreshToken = cookies.refreshToken;

        try {
            const res = await axiosInstance.post('/token',{
                userid: userid,
                refreshToken: refreshToken
            },{withCredentials: true});

            const{accessToken} = res.data;
            setCookie('accessToken', accessToken, { path: '/', httpOnly: true, secure: true });
            return accessToken;

        }catch (error) {
            console.log(error);
        }
    }

    return refresh;
}

export default useRefreshToken
