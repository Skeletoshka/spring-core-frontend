import { Button } from 'antd';
import React from 'react';
import {requestToApi} from '../components/Request';
import '../App.css';
import AdminLK from './AdminLK';
import MethodistLK from './MethodistLK';


export default function LK(){

    function click(event){
        requestToApi.getToken()
    }

    switch(requestToApi.getUserDetails().roles[0]){
        case 'SYSDBA':
            return AdminLK();
        case 'Методист':
            return MethodistLK();
        default:
            return(
                <div>
                    <h1>У вас нет лк:(</h1>
                    <Button onClick={click}>Нажми меня</Button>
                </div>
            )
    }
}