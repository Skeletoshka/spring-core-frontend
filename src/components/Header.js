import React, {Component} from 'react';

const Header = ()=>{

    return(
        <div className='header'>
            <img src={require('../img/auth/logo.png')} height='100%'/>
            <img src={require('../img/auth/name.png')} height='100%'/>
        </div>
    )
}
export default Header; 