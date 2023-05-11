import React from "react";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate()
    localStorage.setItem("tokenAccess", undefined)
    return (
        <div>
            <h1>Домашняя страница</h1>
            <Button onClick={() =>navigate("/news")}>Новости</Button>
            <Button onClick={() =>navigate("/studyprogram")}>Програмы обучения</Button>
            <Button onClick={() =>navigate("/activity")}>Активности</Button>
            <Button onClick={() =>navigate("/auth")}>Авторизация</Button>
        </div>
    )
}