import {Button, Image, Menu, MenuProps} from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";
import MenuItem from "antd/es/menu/MenuItem";

export default function AdminLK(){
    const navigate = useNavigate()
    return(
        <div>
            <h1>Личный кабинет админа</h1>
        </div>
    )
}