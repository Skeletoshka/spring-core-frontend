import { Button } from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";

export default function ContingentLK(){
    const navigate = useNavigate()
    return(
        <div>
            <h1>Личный кабинет работника с контингентом</h1>
            <Button onClick={() =>navigate("/lk/schedule")}>Расписание</Button>
            <Button onClick={() => navigate("/lk/attendance")}>Посещаемость</Button>
        </div>
    )
}