import React, {useEffect} from 'react';
import { Button, Form, Input, Checkbox } from 'antd';
import {requestToApi} from '../components/Request';
import {useNavigate} from "react-router-dom";
import '../App.css';


export default function Auth(){

    const AuthEntity = {
        username:'',
        password:''
    }

    const navigate = useNavigate();

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        console.log(target.name)
        if (target.name === "userName"){AuthEntity.username = value}
        if (target.name === "password"){AuthEntity.password = value}
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
                requestToApi.updateToken(data.accessToken)
                navigate("/lk")
            });
    }

    return(
        <div className='authFormOuter'>
            <div className='authFormMiddle'>
                <div className='authFormInner'>
                    <Form
                        layout={"vertical"}            
                        name="formLogin"
                        style={{ padding: 20 }}
                        initialValues={{}}>

                        <Form.Item
                            name="userName"
                            label="Имя пользователя"
                            rules={[
                                {
                                    required: true,
                                    message: "Имя пользователя не может быть пустым"
                                }
                            ]}>
                            <Input name="userName" onChange={handleChange} placeholder="Login"/>
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
                            <Input.Password name="password" onChange={handleChange} placeholder="Password"/>
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={handleSubmit} className='enterButton'>Войти</Button>
                            <Button onClick={() => {navigate("/registry")}} className='forgetButton'>Регистрация</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}