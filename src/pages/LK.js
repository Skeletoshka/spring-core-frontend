import { Button } from 'antd';
import React, {useEffect} from 'react';
import {requestToApi} from '../components/Request';
import '../App.css';
import AdminLK from './AdminLK';


export default function LK(){

    function click(event){
        requestToApi.getToken()
    }

    if(requestToApi.getUserDetails().roles[0]==="SYSDBA"){
        return AdminLK()
    }else{
        return(
            <div>
                <h1>Личный кабинет</h1>
                <Button onClick={click}>Нажми меня</Button>
            </div>
        )
    }
}