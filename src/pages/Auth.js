import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Descriptions, Form, Input, Modal, Radio, Space, Steps, notification } from 'antd';
import Select from '../components/SelectImpl';
import {requestToApi} from '../components/Request';
import {useNavigate} from "react-router-dom";
import { useForm } from 'antd/es/form/Form';
import '../App.css';


const emptyRegistryEntity = {
    accessRoleId: -1,
    progUserName: "",
    progUserPassword: "",
    progUserEmail: "",
    peopleName: "",
    peopleLastName: "",
    peopleMiddleName: "",
    peopleTelephone: "",
    peopleDateBirth: new Date(),
    childName: "",
    childLastName: "",
    childMiddleName: "",
    childDateBirth: new Date(),
    childTelephone: "",
    companyId: -1,
    companyName: "",
    companyEmail: "",
    companyTelephone: ""
}

export default function Auth(){

    const GridDataOption = {
        rowCount:10,
        page:1,
        orderBy:'accessRoleId',
        from:'accessRole'
    }

    const [active, setActive] = useState(false)
    const [roleList, setRoleList] = useState()
    const [current, setCurrent] = useState(0)
    const [roleId, setRoleId] = useState([])
    const [companyList, setCompanyList] = useState([])
    const [registryEntity, setRegistryEntity] = useState(emptyRegistryEntity)
    const [form] = useForm();
    const [registryForm] = useForm();

    const navigate = useNavigate();

    const steps = [
        {
            title: "Тип аккаунта",
            content: 
                <>
                    <Form.Item name = {"accessRoleId"}>
                        <Radio.Group options={roleList} style={{display:"flex", flexDirection: "column"}} onChange={nextPage}/>
                    </Form.Item>
                </>
        },
        {
            title: "Информация об аккаунте",
            content:
                <>
                    <Form.Item
                        name="progUserName"
                        label="Логин"
                        rules={[
                            {
                                required: true,
                                message: "Логин не может быть пустым"
                            }
                        ]}>
                        <Input name="progUserName" placeholder="Логин"/>
                    </Form.Item>
                    <Form.Item
                        name="progUserPassword"
                        label="Пароль"
                        rules={[
                            {
                                required: true,
                                message : "Пароль не может быть пустым"
                            }
                        ]}>
                            <Input.Password name="progUserPassword" placeholder="Пароль"/>
                    </Form.Item>
                    <Form.Item
                        name="progUserEmail"
                        label="Электронная почта"
                        rules={[
                            {
                                required: true,
                                message : "Электронная почта не может быть пустой"
                            }
                        ]}>
                            <Input name="progUserEmail" placeholder="Электронная почта"/>
                    </Form.Item>
                </>
        },
        {
            title: "Информация о лице",
            content:
            (roleId ===12||roleId===13)?
            <>
                <Form.Item
                    name={"peopleInfo"}
                    label="Информация о родителе"
                >
                    <Form.Item
                        name="peopleName"
                        label="Имя"
                        className='childFormItem'
                        rules={[
                            {
                                required: true,
                                message: "Имя родителя не может быть пустым"
                            }
                        ]}>
                        <Input name="peopleName" placeholder="Имя"/>
                    </Form.Item>
                    <Form.Item
                        name="peopleLastName"
                        label="Фамилия"
                        className='childFormItem'
                        rules={[
                            {
                                required: true,
                                message: "Фамилия родителя не может быть пустой"
                            }
                        ]}>
                        <Input name="peopleLastName" placeholder="Фамилия"/>
                    </Form.Item>
                    <Form.Item
                        name="peopleMiddleName"
                        label="Отчество"
                        className='childFormItem'
                        rules={[
                            {
                                required: true,
                                message: "Отчество родителя не может быть пустым"
                            }
                        ]}>
                        <Input name="peopleMiddleName" placeholder="Отчество"/>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <Form.Item
                        name="peopleTelephone"
                        className='childFormItem'
                        label="Телефон">
                        <Input name="peopleTelephone" placeholder="Телефон"/>
                    </Form.Item>
                    <Form.Item
                        name="peopleDateBirth"
                        label="Дата рождения"
                        className='childFormItem'
                        rules={[
                            {
                                required: true,
                                message: "Дата рождения не может быть пустой"
                            }
                        ]}>
                        <DatePicker name="peopleDateBirth" placeholder="Дата рождения"/>
                    </Form.Item>
                </Form.Item>
                <Form.Item
                    name={"childInfo"}
                    label="Информация о ребенке"
                >
                    <Form.Item
                        name="childName"
                        label="Имя"
                        className='childFormItem'
                        rules={[
                            {
                                required: true,
                                message: "Имя родителя не может быть пустым"
                            }
                        ]}>
                        <Input name="childName" placeholder="Имя"/>
                    </Form.Item>
                    <Form.Item
                        name="childLastName"
                        label="Фамилия"
                        className='childFormItem'
                        rules={[
                            {
                                required: true,
                                message: "Фамилия родителя не может быть пустой"
                            }
                        ]}>
                        <Input name="childLastName" placeholder="Фамилия"/>
                    </Form.Item>
                    <Form.Item
                        name="childMiddleName"
                        label="Отчество"
                        className='childFormItem'
                        rules={[
                            {
                                required: true,
                                message: "Отчество родителя не может быть пустым"
                            }
                        ]}>
                        <Input name="childMiddleName" placeholder="Отчество"/>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <Form.Item
                        name="childTelephone"
                        className='childFormItem'
                        label="Телефон">
                        <Input name="childTelephone" placeholder="Телефон"/>
                    </Form.Item>
                    <Form.Item
                        name="childDateBirth"
                        label="Дата рождения"
                        className='childFormItem'
                        rules={[
                            {
                                required: true,
                                message: "Дата рождения не может быть пустой"
                            }
                        ]}>
                        <DatePicker name="childDateBirth" placeholder="Дата рождения"/>
                    </Form.Item>
                    <Form.Item
                        name="studentClass"
                        label="Класс"
                        className='childFormItem'
                        rules={[
                            {
                                required: true,
                                message: "Класс не может быть пустой"
                            }
                        ]}>
                        <Input name="studentClass" autoComplete="off"
                               placeholder="Класс"/>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <Form.Item
                        name="studentMun"
                        label="Муниципальное образование"
                        className='childFormItem'
                        rules={[
                            {
                                required: true,
                                message: "Муниципальное образование не может быть пустым"
                            }
                        ]}>
                        <Input name="studentMun" autoComplete="off" width={"50%"}
                               placeholder="Муниципальное образование"/>
                    </Form.Item>
                    <Form.Item
                        name="companyId"
                        label="Школа"
                        className='childFormItem'
                        style={{width:"50%"}}
                        rules={[
                            {
                                required: true,
                                message: "Школа не может быть пустой"
                            }
                        ]}>
                        <Select
                            style={{ width: '100%' }}
                            onClick={() => {
                                if(companyList.length === 0) {
                                    requestToApi.post("/security/v1/apps/auth/company/getlist", {
                                        rowCount:100,
                                        page:1,
                                        orderBy:'companyId'
                                    })
                                        .then(data => setCompanyList(data.result));
                                }
                            }}
                            options={companyList.map((company) => {
                                return {
                                    label: company.companyName,
                                    value: company.companyId
                                }
                            })}
                        />
                    </Form.Item>
                </Form.Item>
            </>:
            <>
                <Form.Item
                        name="companyName"
                        label="Наименование партнёра"
                        rules={[
                            {
                                required: true,
                                message: "Наименование партнёра не может быть пустым"
                            }
                        ]}>
                        <Input name="companyName"
                               placeholder="Наименование партнёра"/>
                    </Form.Item>
                    <Form.Item
                        name="companyTelephone"
                        label="Телефон">
                        <Input name="companyTelephone"
                               placeholder="Телефон"/>
                    </Form.Item>
                    <Form.Item
                        name="companyEmail"
                        label="Электронный адрес">
                        <Input name="companyEmail"
                               placeholder="Электронный адрес"/>
                    </Form.Item>
            </>
        }
    ]

    useEffect(() => {
        requestToApi.clearUserDetails()
        if(roleList === undefined){
            requestToApi.post("/security/v1/apps/auth/getroles", GridDataOption)
            .then(data => {
                setRoleList(data?.map(role => {
                    return {
                        label: role.accessRoleName,
                        value: role.accessRoleId
                    }
                }))
            });
        }
    });

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

    function registry(){
        registryForm.validateFields().then((values) => {
            console.log(values)
            if(registryEntity.accessRoleId === 12 || registryEntity.accessRoleId === 13){
                registryEntity.peopleName = values.peopleName;
                registryEntity.peopleLastName = values.peopleLastName;
                registryEntity.peopleMiddleName = values.peopleMiddleName;
                registryEntity.peopleDateBirth = new Date(values.peopleDateBirth).getTime();
                registryEntity.peopleTelephone = values.peopleTelephone;
                registryEntity.childName = values.childName;
                registryEntity.childLastName = values.childLastName;
                registryEntity.childMiddleName = values.childMiddleName;
                registryEntity.childDateBirth = new Date(values.childDateBirth).getTime();
                registryEntity.childTelephone = values.childTelephone;
                registryEntity.companyId = values.companyId
            }else{
                registryEntity.companyName = values.companyName;
                registryEntity.companyTelephone = values.companyTelephone;
                registryEntity.companyEmail = values.companyEmail;
            }
            console.log(registryEntity)
            requestToApi.post('/security/v1/apps/auth/registeruser', registryEntity)
            .then(data => {
                if(data.status !== undefined){
                    setActive(false);
                    setRegistryEntity(emptyRegistryEntity)
                    registryForm.resetFields()
                }
            });
        })
    }

    function nextPage(){
        registryForm.validateFields().then((values) => {
            if(current === 0) {
                registryEntity.accessRoleId = values.accessRoleId;
                setRoleId(values.accessRoleId)
            }
            if(current === 1) {
                registryEntity.progUserName = values.progUserName;
                registryEntity.progUserPassword = values.progUserPassword;
                registryEntity.progUserEmail = values.progUserEmail;
            }
        })
        setCurrent(current + 1)
    }

    function prevPage(){
        setCurrent(current - 1)
    }

    return(
        <div>
            <Modal 
                open={active} 
                title="Регистрация" 
                width={"50%"}
                onCancel = {cancel}
            footer={[
                (current < steps.length - 1) ?
                    <Button onClick={nextPage}>
                        Далее
                    </Button>:
                    <Button onClick={registry}>
                        Зарегистрироваться
                    </Button>,
                (current > 0) ?
                <Button onClick={prevPage}>
                    Назад
                </Button>:<></>
            ]}>
                <Steps current={current} items={steps.map((item) => ({key: item.title, title: item.title}))}/>
                <Form 
                    form={registryForm}
                    className='registry' 
                    layout={"vertical"}>
                        {steps[current].content}
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