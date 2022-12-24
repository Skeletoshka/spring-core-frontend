import React, { useState } from 'react';
import { Button, Form, Input, Select, Modal } from 'antd';
import {requestToApi} from '../components/Request';
import {useNavigate} from "react-router-dom";
import '../App.css';


export default function Auth(){

    const AuthEntity = {
        username:'',
        password:''
    }

    const RegistryEntity = {
        username:"",
        password:"",
        email:"",
        role: []
    }

    const [active, setActive] = useState(false)
    const [roles, setRoles] = useState()
    const [roleList, setRoleList] = useState()

    const navigate = useNavigate();

    function fillRoles(){
        requestToApi.post("/api/accessrole/getlist", {id: 1})
        .then(response => {
            if(!response.ok){
                throw response.message
            }else{
                return response.json()
            }
        })
        .then(data => {
            setRoles(data);
        });
        setRoleList(roles?.map(role => {
            return <Select.Option value={role.accessRoleId}>
                {role.accessRoleFullName}
            </Select.Option>
        }))
    }

    function submit(){
        console.log(RegistryEntity)
        requestToApi.post("/api/auth/signup", RegistryEntity)
        .then(response => {
            if(!response.ok){
                throw response.message
            }else{
                return response.json()
            }
        });
        setActive(false)
    }

    async function handleSubmit(event){
        event.preventDefault();
        requestToApi.post('/api/auth/signin', AuthEntity)
            .then(response => {
                if(!response.ok){
                    if ([401, 403].includes(response.status)) {
                        throw 'Не удалось авторизоваться'
                    }
                    throw 'Не удалось авторизоваться'
                }else{
                    return response.json()
                }
            })
            .then(data => {
                requestToApi.updateToken(data.token)
                navigate("/lk")
            });
    }

    function cancel(){
        setActive(false)
    }

    return(
        <div>
            <Modal open={active} title="Регистрация" 
            footer={[
                <Button onClick={submit}>
                    Зарегестрироваться
                </Button>,
                <Button onClick={cancel}>
                    Назад
                </Button>
            ]}>
                <Form
                    layout={"vertical"}            
                    name="formRegistry"
                    style={{ padding: 20 }}>
                        <Form.Item 
                        name="roles"
                        label="Роль пользователя">
                            <Select onChange={(value) => { 
                                RegistryEntity.role.push({
                                    accessRoleId:value,
                                    accessRoleFullName:"",
                                    accessRoleName:""
                                })
                                console.log(RegistryEntity.role)
                            }} onClick={fillRoles}>
                                {roleList}
                            </Select>
                        </Form.Item >
                        <Form.Item
                            name="username"
                            label="Логин"
                            rules={[
                                {
                                    required: true,
                                    message: "Логин не может быть пустым"
                                }
                            ]}>
                            <Input name="username" onChange={(event) => {
                                RegistryEntity.username = event.target.value
                            }} placeholder="Логин"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Пароль"
                            rules={[
                                {
                                    required: true,
                                    message : "Пароль не может быть пустым"
                                }
                            ]}>
                                <Input name="password" onChange={(event) => {
                                RegistryEntity.password = event.target.value
                            }} placeholder="Пароль"/>
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Электронная почта"
                            rules={[
                                {
                                    required: true,
                                    message : "Электронная почта не может быть пустой"
                                }
                            ]}>
                                <Input name="email" onChange={(event) => {
                                RegistryEntity.email = event.target.value
                            }} placeholder="Электронная почта"/>
                        </Form.Item>
                </Form>
            </Modal>
        <div className='authFormOuter'>
            <div className='authFormMiddle'>
                <div className='authFormInner'>
                    <Form
                        layout={"vertical"}            
                        name="formLogin"
                        style={{ padding: 20 }}>

                        <Form.Item
                            name="userName"
                            label="Имя пользователя"
                            rules={[
                                {
                                    required: true,
                                    message: "Имя пользователя не может быть пустым"
                                }
                            ]}>
                            <Input name="userName" onChange={(event) => {AuthEntity.username = event.target.value}} placeholder="Login"/>
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Пароль"
                            rules={[
                                {
                                    required: true,
                                    message: "Пароль не может быть пустым"
                                }
                            ]}
                        >
                            <Input.Password name="password" onChange={(event) => {AuthEntity.password = event.target.value}} placeholder="Password"/>
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={handleSubmit} className='enterButton'>Войти</Button>
                            <Button onClick={() => {setActive(true)}} className='forgetButton'>Регистрация</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
        </div>
    )
}