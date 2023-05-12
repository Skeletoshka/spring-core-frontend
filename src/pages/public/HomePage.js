import React from "react";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {requestToApi} from "../../components/Request";

export default function HomePage() {
    const navigate = useNavigate()
    requestToApi.clearUserDetails()
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