import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import LK_Info from '../components/LK_info';
import { requestToApi } from "../components/Request"

export default function MethodistLK(){

    const navigate = useNavigate()
    const [progUser, setProgUser] = useState(undefined)

    useEffect(() => {
        if(progUser===undefined){
            requestToApi.post("/v1/apps/dnk/objects/people/get ", requestToApi.getUserDetails().peopleId)
            .then(data => {
                setProgUser(data)
            });
        }
    })


    return(
        <div>
            <h1>Личный кабинет методиста</h1>
            <LK_Info people = {progUser}/>
            <Button onClick={() =>navigate("/lk/studyprogram")}>Программы обучения</Button>
            <Button onClick={() =>navigate("/lk/direction")}>Направления</Button>
            <Button onClick={() =>navigate("/lk/people")}>Люди</Button>
            <Button onClick={() =>navigate("/lk/activity")}>Мероприятия</Button>
        </div>
    )

}