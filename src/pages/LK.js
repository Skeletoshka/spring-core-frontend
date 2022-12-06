import { Button } from 'antd';
import React, {useEffect} from 'react';
import {requestToApi} from '../components/Request';
import '../App.css';


export default function LK(){

    function click(event){
        requestToApi.getToken()
    }

    return(
        <div>
            <h1>Личный кабинет</h1>
            <Button onClick={click}>Нажми меня</Button>
        </div>
    )
}