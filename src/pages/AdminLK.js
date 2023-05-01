import { Button } from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";

export default function AdminLK(){
    const navigate = useNavigate()
    return(
        <div>
            <h1>Личный кабинет админа</h1>
            <Button onClick={() =>navigate("/lk/controlobject")}>Права</Button>
            <Button onClick={() =>navigate("/lk/proguser")}>Пользователи</Button>
            <Button onClick={() =>navigate("/roles")}>Роли</Button>
        </div>
    )
}