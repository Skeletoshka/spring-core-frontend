import React from 'react';
import { useNavigate } from "react-router-dom";
import {Image} from "antd";

const Header = ()=>{
    const navigate = useNavigate()
    return(
        <div className='header'>
            <Image src={require('../img/auth/logo.png')}
                 height='100%' onClick={() => navigate("/")}/>
            <Image src={require('../img/auth/name.png')} height='100%'/>
        </div>
    )
}
export default Header; 