import React, {useState, useEffect} from 'react'
import {useLoggedState, useLoggedUser} from '../store/store';

const MainPage = () => {
  const [user, setUser] = useState('');

  const {loggedState} = useLoggedState();
  const {userid} = useLoggedUser();
  
  

  useEffect(() => {

    if(loggedState && userid) {
      setUser(userid);
    }
    
  }, [loggedState, userid])
  
  
  return (
    <section>

      {
        loggedState && userid ? 
        <div className='main'>
          <p>
            환영합니다 <span className='user_name'>{user}</span>님
          </p>
        </div>
        :
        <div className='main'>
          <p>
            로그인 해주세요
          </p>
        </div>
        
      }

      

    </section>
  )
}

export default MainPage