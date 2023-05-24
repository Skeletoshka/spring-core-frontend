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
            <NewsPublic/>
        </div>
    )
}