import React from 'react';
import { useNavigate } from "react-router-dom";
import {Image, Menu, MenuProps} from "antd";
import Title from "antd/es/skeleton/Title";

const Header = ()=>{
    const navigate = useNavigate()
    const items: MenuProps['items']=[
        {
            icon: <Image src={require('../img/auth/logo.png')} preview={false}
                         height='60px' onClick={() => navigate("/")}
                         style={{cursor:"pointer"}}/>
        },
        {
            label: <div style={{fontSize:"1.5em"}}>Документы</div>,
            key: "documents",
            children:[
                {
                    label: "Документ 1",
                    key: "documents_1"
                },
                {
                    label: "Документ 2",
                    key: "documents_2"
                }
            ],
            style:{fontsize:"5em"}
        },
        {
            label: <div style={{fontSize:"1.5em"}}>Администрирование</div>,
            key: "admin",
            children:[
                {
                    label: "Права",
                    key: "access",
                    onClick: () => {navigate("/lk/controlobject")}
                },
                {
                    label: "Пользователи",
                    key: "users",
                    onClick: () => {navigate("/lk/proguser")}
                },
                {
                    label: "Роли",
                    key: "roles",
                    onClick: () => {navigate("/roles")}
                }
            ]
        }
    ]
    return(
        <div style={{height:"5%"}}>
            <Menu mode={"horizontal"} items={items} style={{backgroundColor: "orange"}}/>
        </div>
    )
}
export default Header; 