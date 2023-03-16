import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import { requestToApi } from "../components/Request"

export default function AdminLK(){
    const GridDataOption = {
        rowCount:10,
        page:1,
        orderBy:'accessRoleId',
        from:'accessRole'
    }

    const navigate = useNavigate()

    useEffect(() => {
        /*requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOption)
        .then(data => {
            console.log(JSON.stringify(data))
        });*/
    })

    return(
        <div>
            <h1>Личный кабинет админа</h1>
            <Button onClick={() =>navigate("/lk/controlobject")}>Права</Button>
            <Button onClick={() =>navigate("/lk/proguser")}>Пользователи</Button>
            <Button onClick={() =>navigate("/roles")}>Роли</Button>
        </div>
    )
}