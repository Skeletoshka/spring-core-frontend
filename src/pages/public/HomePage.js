import React from "react";
import {Button, Menu} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {requestToApi} from "../../components/Request";
import {UserOutlined} from '@ant-design/icons'
import NewsBlock from "../../components/NewsBlock";
import NewsPublic from "./News";

export default function HomePage() {
    const navigate = useNavigate()
    requestToApi.clearUserDetails()
    return (
        <div>
            <Menu mode={"horizontal"} className={"menu"}>
                <Menu.Item title={"Новости"}><Link to={"/news"}>Новости</Link></Menu.Item>
                <Menu.Item title={"Програмы обучения"} onClick={() => navigate("/studyprogram")}>Програмы обучения</Menu.Item>
                <Menu.Item title={"Активности"} onClick={() => navigate("/activity")}>Активности</Menu.Item>
                <Menu.Item title={"Авторизация"} className={"menu_item"} onClick={() => navigate("/auth")}><Button icon={<UserOutlined/>} style={{border:"none"}}/></Menu.Item>
            </Menu>
            <NewsPublic/>
        </div>
    )
}