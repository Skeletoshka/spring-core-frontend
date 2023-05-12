import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import LK_Info from '../components/LK_info';
import { requestToApi } from "../components/Request"

export default function ParentLK(){

    const navigate = useNavigate()
    const [progUser, setProgUser] = useState(undefined)

    useEffect(() => {
        if(progUser===undefined){
            requestToApi.post("/v1/apps/dnk/objects/people/get ", localStorage.getItem("peopleId"))
                .then(data => {
                    setProgUser(data)
                });
        }
    })


    return(
        <div>
            <h1>Личный кабинет Родителя</h1>
            <LK_Info people = {progUser}/>
            <Button onClick={() =>navigate("/lk/studyprogram")}>Программы обучения</Button>
        </div>
    )

}