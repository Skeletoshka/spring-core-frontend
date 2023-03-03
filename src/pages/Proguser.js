import { Button, Checkbox, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';

export default function Proguser(){

    const [progUserList, setProgUserList] = useState()

    const GridDataOption = {
        rowCount:10,
        page:1,
        orderBy:'proguser_id',
        from:'proguser'
    }

    const columns = [
        {
            render: () => {<Checkbox/>}
        },
        {
            title:'Имя пользователя',
            dataIndex:'progUserName',
            key:'progUserName'
        },
        {
            title:'Полное имя пользователя',
            dataIndex:'progUserFullName',
            key:'progUserFullName'
        },
        {
            title:'Активность',
            dataIndex:'progUserActive',
            key:'progUserActive'
        },
        {
            title:'Человек',
            dataIndex:'peopleId',
            key:'peopleId'
        }
    ]

    useEffect(() => {
        if(progUserList===undefined){
            requestToApi.post("/v1/apps/objects/proguser/getlist", GridDataOption)
            .then(response => {
                if(!response.ok){
                    alert(response.message)
                }else{
                    return response.json()
                }
            })
            .then(data => setProgUserList(data));
        }else{
            console.log(JSON.stringify(progUserList))
        }
    })

    return(
        <div>
            <div>
                <h1>Пользователи</h1>
                <div style={{position: 'relative', left:'85%' }}>
                    <Button>Удалить</Button>
                    <Button>Обновить</Button>
                    <Button>Добавить</Button>
                </div>
            </div>
            <Table dataSource={progUserList} columns={columns}/>
        </div>
    )
}