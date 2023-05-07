import { Button } from 'antd';
import React from 'react';
import {requestToApi} from '../components/Request';
import '../App.css';
import AdminLK from './AdminLK';
import MethodistLK from './MethodistLK';
import AdmActivityLK from "./AdmActivityLK";
import ContingentLK from "./ContingentLK";


export default function LK(){
    switch(localStorage.getItem("roles")){
        case 'SYSDBA':
            return AdminLK();
        case 'Методист':
            return MethodistLK();
        case 'Администратор активности':
            return AdmActivityLK();
        case 'Работник с контингентом':
            return ContingentLK();
        default:
            return(
                <div>
                    <h1>У вас нет лк:(</h1>
                </div>
            )
    }
}