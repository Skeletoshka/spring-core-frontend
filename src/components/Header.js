import React from 'react';
import { useNavigate } from "react-router-dom";
import {Button, Image, Menu, MenuProps} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {requestToApi} from "./Request";

const Header = ()=>{
    const navigate = useNavigate()
    const items: MenuProps['items']=[
        {
            icon: <Image src={require('../img/auth/logo.png')} preview={false}
                         height='50px' onClick={() => navigate("/")}
                         style={{cursor:"pointer"}}/>
        },
        {
            label: <div style={{fontSize:"1.5em"}}>Документы</div>,
            key: "documents",
            children:[
                {
                    label: "Обучение",
                    key: "study",
                    children: [
                        {
                            label: "Программы обучения",
                            key: "studyProgram",
                            onClick: () => navigate("/lk/studyprogram")
                        },
                        {
                            label: "Направления",
                            key: "direction",
                            onClick: () => navigate("/lk/direction")
                        },
                        {
                            label: "Расписание",
                            key: "schedule",
                            onClick: () => navigate("/lk/schedule")
                        },
                        {
                            label: "Группы",
                            key: "workgroup",
                            onClick: () => navigate("/lk/workgroup")
                        },
                        {
                            label: "Активности",
                            key: "activity",
                            onClick: () => navigate("/lk/activity")
                        }
                    ]
                },
                {
                    label: "Заявки",
                    key: "request",
                    onClick: () => navigate("/lk/request")
                },
                {
                    label: "Файлы",
                    key: "files",
                    onClick: () => navigate("/lk/file")
                },
                {
                    label: "Договора",
                    key: "contracts",
                    onClick: () => navigate("/lk/contract")
                },
                {
                    label: "Новости",
                    key: "news",
                    onClick: () => navigate("/lk/news")
                },
                {
                    label: "Отчёт",
                    key: "report",
                    children: [
                        {
                            label: "Программы обучения",
                            key: "reportStudyProgram",
                            onClick: () => navigate("/lk/people/report")
                        },
                        {
                            label: "Посещаемость",
                            key: "attendanceReport",
                            onClick: () => navigate("lk/attendance/report")
                        }
                    ]
                }
            ],
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
                },
                {
                    label: "Люди",
                    key: "people",
                    onClick: () => {navigate("/lk/people")}
                },
                {
                    label: "Ученики",
                    key: "student",
                    onClick: () => navigate("/lk/people/student")
                },
                {
                    label: "Партнёры",
                    key: "companies",
                    onClick: () => navigate("/lk/company")
                }
            ]
        }
    ]

    const itemsPublic: MenuProps['items']=[
        {
            icon: <Image src={require('../img/auth/logo.png')} preview={false}
                         height='50px' onClick={() => navigate("/")}
                         style={{cursor:"pointer"}}/>
        },
        {
            label: <div style={{fontSize:"1.5em"}}>Новости</div>,
            key: "news",
            onClick: () => navigate("/news")
        },
        {
            label: <div style={{fontSize:"1.5em"}}>Програмы обучения</div>,
            key: "studyprogram",
            onClick: () => navigate("/studyprogram")
        },
        {
            label: <div style={{fontSize:"1.5em"}}>Активности</div>,
            key: "activity",
            onClick: () => navigate("/activity")
        },
        {
            label: <Button icon={<UserOutlined/>} style={{border:"none"}}/>,
            key: "auth",
            onClick: () => navigate("/auth")
        }
    ]

    return(
        <div style={{backgroundColor: "orange"}}>
            <Menu mode={"horizontal"} items={requestToApi.isAuthUser()?items:itemsPublic} style={{backgroundColor: "orange"}}/>
        </div>
    )
}
export default Header; 