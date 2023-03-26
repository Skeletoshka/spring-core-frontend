import { Button } from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";

export default function MethodistLK(){

    const navigate = useNavigate()

    return(
        <div>
            <h1>Личный кабинет методиста</h1>
            <Button onClick={() =>navigate("/lk/studyprogram")}>Программы обучения</Button>
        </div>
    )
}