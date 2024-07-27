import React, {useState} from 'react'
import '../css/account.css'
import { FaRegUser } from "react-icons/fa6";
import { IoLockClosedOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [confirmPw, setConfirmPw] = useState("");
  const [checkPw, setCheckPw] = useState(false);

  const navigate = useNavigate();


  const [regInfo, setRegInfo] = useState({
    userId: "",
    userPw: "",
    userName: "",
    userEmail: "",
  });

  
  const handleChangeInfo = (e) => {

    //기존 정보 객체 복사
    const infoObj = {...regInfo};

    //인풋 값
    const val = e.target.value;

    //인풋 종류에 따라 객체에 값 할당
    if(e.target.name === "createId") {
      infoObj.userId = val;
    }else if(e.target.name === "createPw") {
      infoObj.userPw = val;
    }else if(e.target.name === "createUsername") {
      infoObj.userName = val;
    }else if(e.target.name === "createEmail") {
      infoObj.userEmail = val;
    }else if(e.target.name === "createConfirmPw"){
      //비밀번호 확인
      setConfirmPw(val);

      if(val === regInfo.userPw){
        setCheckPw(true);
      }else {
        setCheckPw(false);
      }
    }

    
    //스테이트에 할당
    setRegInfo(infoObj);
  }

  const handleClickCreate = async(e) => {
    e.preventDefault();

    try { 

      if (regInfo.userId && regInfo.userPw && regInfo.userName && regInfo.userEmail) {
        if(confirmPw) {
          if(regInfo.userPw === confirmPw){
            //send data from db
            const res = await axios.post('http://localhost:4000/users', {
              userid: regInfo.userId,
              password: regInfo.userPw,
              username: regInfo.userName,
              email: regInfo.userEmail,
            });

            const {status} = res;

            if(status === 200) {
              alert("가입이 완료되었습니다!");
              navigate("/login");
            }

          }else {
            alert("비밀번호 확인이 일치하지 않습니다!");
          }  
        }else {
          alert("비밀번호를 확인해주세요!")
        }
        
      }else {
        alert("모든 항목을 입력해주세요!")
      }
      
    }catch (error) {

      console.error(error);
      alert("계정 생성에 실패했습니다.");

    }
  }


  return (
    <div className='account_form'>
      <div className='form_box register_form'>
        <h2 className='form_tit'>New Account</h2>
        <div className='form_row'>
          <h4>ID</h4>
          <div className='input_box'><span className='ico_wrap ico_id'><FaRegUser size="100%" fill="#333"/></span><input type="text" name='createId' onChange={handleChangeInfo}/></div>
        </div>
        <div className='form_row'>
          <h4>Pasaword</h4>
          <div className='input_box'><span className='ico_wrap ico_pw'><IoLockClosedOutline size="100%" fill="#333"/></span><input type="password" name='createPw' onChange={handleChangeInfo}/></div>
        </div>
        <div className="form_row" >
          <h4>Comfirm Pasaword</h4>
          <div className={`input_box ${!checkPw && confirmPw.length ? "discordPw": ""}`}><span className='ico_wrap ico_pw'><IoLockClosedOutline size="100%" fill="#333"/></span><input type="password" name='createConfirmPw' onChange={handleChangeInfo}/></div>
        </div>
        <div className='form_row'>
          <h4>Name</h4>
          <div className='input_box'><span className='ico_wrap ico_id'><FaRegUser size="100%" fill="#333"/></span><input type="text" name='createUsername' onChange={handleChangeInfo}/></div>
        </div>
        <div className='form_row'>
          <h4>Email</h4>
          <div className='input_box'><span className='ico_wrap ico_email'><MdOutlineEmail  size="100%" fill="#333"/></span><input type="email" name='createEmail'onChange={handleChangeInfo} /></div>
        </div>
        <button className='btn_account' onClick={handleClickCreate}>Create Account</button>
      </div>
    </div>
  )
}

export default Register