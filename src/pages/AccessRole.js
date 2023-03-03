import {Button, Form, Input, Checkbox,Select,Menu,Table } from 'antd';
import { Container } from 'reactstrap';
import {requestToApi} from '../components/Request';
import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";


export default function AccessRole(){

    const columns = [   

        {
            title: 'Роль',
            dataIndex: 'accessRoleName',
            key: 'accessRoleName',
        },
        {
            title: 'Польное название роли',
            dataIndex: 'accessRoleFullName',
            key: 'accessRoleFullName',
        },
    ]

    const onChange = (e) => {
        console.log('Change:', e.target.value);
      };

    const [active, setActive] = useState(false)
    const [roleList, setRoleList] = useState()
    
    const GridDataOption = {
        //namedFilters:{},
        rowCount:10,
        page:1,
        orderBy:'accessRoleId',
        from:'accessRole'
    }


    useEffect(() => {
        if(roleList === undefined){
            requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOption)
            .then(response => {
                if(!response.ok){
                    alert("Ошибка получения данных с сервера")
                }else{
                    return response.json()
                }
            })
            .then(data => {
                setRoleList(data)
            });
        }
    });

   
    


    return(
        <div>
            <h1>Роли пользователя</h1>
            <header>
						{/* Кнопки навигации */}
                      
                        <ul className="navig_rol">
                 		<Form.Item>
                            <Button onClick={onChange}>Удалить</Button>
                            <Button onClick={onChange}>Отправить</Button>
                            <Button onClick={onChange}>Обновить</Button>
                            <Button onClick={onChange}>Добавить</Button>
                        </Form.Item>
												
						 </ul>
                        					
            </header>
        
            <div className='table'>
                <Table dataSource={roleList} columns={columns} />;
            </div>

        </div>
    )
}