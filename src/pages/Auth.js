import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Modal } from 'antd';
import {requestToApi} from '../components/Request';
import {useNavigate} from "react-router-dom";
import { useForm } from 'antd/es/form/Form';
import '../App.css';


export default function Auth(){

    const RegistryEntity = {
        username:"",
        password:"",
        email:"",
        role: []
    }

    const GridDataOption = {
        //namedFilters:{},
        rowCount:10,
        page:1,
        orderBy:'accessRoleId',
        from:'accessRole'
    }

    const [active, setActive] = useState(false)
    const [roleList, setRoleList] = useState()
    const [form] = useForm();

    const navigate = useNavigate();

    useEffect(() => {
        requestToApi.clearUserDetails()
        if(roleList === undefined){
            requestToApi.post("/security/v1/apps/auth/getroles", GridDataOption)
            .then(data => {
                setRoleList(data?.map(role => {
                    return <Select.Option value={role.accessRoleId}>
                        {role.accessRoleFullName}
                    </Select.Option>
                }))
            });
        }
    });

    function submit(){
        requestToApi.post("/security/v1/apps/auth/signup", RegistryEntity)
        setActive(false)
    }

    async function handleSubmit(event){
        requestToApi.updateUserDetails(undefined)
        form.validateFields().then((values) => {
            requestToApi.post('/security/v1/apps/auth/signin', values)
                .then(data => {
                    if(data.token !== undefined){
                        requestToApi.updateUserDetails(data)
                        navigate("/lk")
                    }
                });
        })
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
                            }}>
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
                                <Input.Password name="password" onChange={(event) => {
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
                        form={form}
                        style={{ padding: 20 }}>

                        <Form.Item
                            name="username"
                            label="Имя пользователя"
                            rules={[
                                {
                                    required: true,
                                    message: "Имя пользователя не может быть пустым"
                                }
                            ]}>
                            <Input name="username" placeholder="Login"/>
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
                            <Input.Password name="password" placeholder="Password"/>
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