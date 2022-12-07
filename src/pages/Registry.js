import { Button, Form, Input, Select } from "antd";
import {json, useNavigate} from "react-router-dom";
import {requestToApi} from '../components/Request';

export default function Registry() {

    const navigate = useNavigate();

    const RegistryEntity = {
        username:"",
        password:"",
        email:"",
        role: [
            {
                accessRoleId: 0,
                accessRoleName: 'SYSDBA',
                accessRoleFullName: "Системный администратор"
            }
        ]
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
        })
        .then(data => {
            navigate("/")
        });
    }

    return(
        <div className='registryFormOuter'>
            <div className='registryFormMiddle'>
                <div className="registryFormInner">
                    <h3>Регистрация</h3>
                    <Form
                        layout={"vertical"}            
                        name="formRegistry"
                        style={{ padding: 20 }}
                        initialValues={{}}>
                            <Form.Item 
                            name="roles"
                            label="Роль пользователя">
                                <Select>
                                    <Select.Option value="1">Системный администратор</Select.Option>
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
                            <Button onClick={submit}>
                                Зарегестрироваться
                            </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}