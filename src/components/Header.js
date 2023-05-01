import React from 'react';
import { useNavigate } from "react-router-dom";
import {Button} from "antd";

const Header = ()=>{
    const navigate = useNavigate()
    return(
        <div className='header'>
            <img src={require('../img/auth/logo.png')}
                 height='100%' onClick={() => navigate("/")}/>
            <img src={require('../img/auth/name.png')} height='100%'/>
        </div>
    )
}
export default Header; 