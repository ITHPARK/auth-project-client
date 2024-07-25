import axios from 'axios';


export const fetchUserData = async(userid, cookieToken) => {
    try {
        const token = cookieToken;
        const res = await axios.get(`http://localhost:4000/users/${userid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;

    }catch (error){
        console.error(error);
    }

}
