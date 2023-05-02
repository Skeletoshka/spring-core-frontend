import React from 'react';
import { useNavigate } from "react-router-dom";
import {Image} from "antd";

const Header = ()=>{
    const navigate = useNavigate()
    return(
        <div className='header'>
            <Image src={require('../img/auth/logo.png')} preview={false}
                 height='100%' onClick={() => navigate("/")}
                 style={{cursor:"pointer"}}
                 />
            <Image src={require('../img/auth/name.png')} preview={false} height='100%'/>
        </div>
    )
}
export default Header; 