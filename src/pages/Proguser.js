import { Button, Modal, Table, Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";

const columns = [
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

const GridDataOption = {
    rowCount:10,
    page:1,
    orderBy:'progUserId',
    from:'proguser'
}

const PeopleGridDataOption = {
    rowCount:10,
    page:1,
    orderBy:'peopleId',
    from:'people'
}

export default function Proguser(){

    const [progUserList, setProgUserList] = useState()
    const [proguser, setProgUser] = useState()
    const [show, setShow] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [accessRoleList, setAccessRoleList] = useState([])
    const [peopleList, setPeopleList] = useState([])
    const [loading, setLoading] = useState(true)
    const [form] = useForm()

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    
    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    function cancel(){
        setShow(false)
        setProgUser(undefined)
    }

    useEffect(() => {
        requestToApi.post("/v1/apps/objects/proguser/getlist", GridDataOption)
            .then(data => setProgUserList(data));
        requestToApi.post("/v1/apps/objects/people/getlist", PeopleGridDataOption)
            .then(data => setPeopleList(data));
        requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOption)
            .then(data => setAccessRoleList(data));
    }, [loading])

    function reload(){
        setLoading(true)
    }

    function add(){
        requestToApi.post("/v1/apps/objects/proguser/get", null)
        .then(data => {
            setProgUser(data)
            setShow(true)
            reload()
            form.resetFields()
        });
    }

    function edit(id){
        requestToApi.post("/v1/apps/objects/proguser/get", id)
        .then(data => {
            setProgUser(data) 
            setShow(true)
            reload()
            form.resetFields()
        });
    }

    function submit(){
        form.validateFields().then((values) => {
            requestToApi.post("/v1/apps/objects/proguser/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                    setProgUser(undefined)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/objects/proguser/delete", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={add}>Добавить</Button>
    ]

    return(
        <div>
            <PageHeader
                title={"Пользователи"}
                buttons={buttons}
            />
            <Modal open = {show}
            title="Изменение пользователя" 
            onCancel={cancel}
            footer={[
                <Button onClick={submit}>
                    Добавить
                </Button>,
                <Button onClick={cancel}>
                    Назад
                </Button>
            ]}>
                <Form
                    form={form}
                    layout={"vertical"}
                    initialValues={proguser}
                    name="formRegistry"
                    style={{ padding: 20 }}>
                        <Form.Item
                            name="progUserName"
                            label="Имя пользователя"
                            rules={[
                                {
                                    required: true,
                                    message: "Имя пользователя не может быть пустым"
                                }
                            ]}>
                            <Input name="username"
                            ref={(input) => show&&input&&input.focus}
                            placeholder="Имя пользователя" 
                            value={proguser===undefined?'':proguser.progUserName}/>
                        </Form.Item>
                        <Form.Item
                            name="progUserFullName"
                            label="Полное имя пользователя">
                            <Input name="fullusername" placeholder="Полное имя пользователя" value={proguser===undefined?'':proguser.progUserFullName}/>
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
                                <Input name="progUserPassword" placeholder="Пароль"/>
                        </Form.Item>
                        <Form.Item
                            name="progUserActive"
                            label="Активность пользователя"
                            rules={[
                                {
                                    required: true,
                                    message : "Активность пользователя не может быть пустым"
                                }
                            ]}>
                                <Input name="progUserActive" placeholder="Активность пользователя"
                                       value={proguser===undefined?'':proguser.progUserActive}/>
                        </Form.Item>
                        <Form.Item
                            name="progUserRoles"
                            label="Роли пользователя"
                            rules={[
                                {
                                    required: true,
                                    message : "Роли пользователя не может быть пустыми"
                                }
                            ]}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                defaultValue={proguser===undefined?[]:proguser.accessRoleViews?.map((accessrole) => {
                                    return {
                                        label: accessrole.accessRoleName,
                                        value: accessrole.accessRoleId
                                    }
                                })}
                                options={accessRoleList.map((accessrole) => {
                                    return {
                                        label: accessrole.accessRoleName,
                                        value: accessrole.accessRoleId
                                    }
                                })}
                            />
                        </Form.Item>
                        <Form.Item
                            name="peopleId"
                            label="Человек для пользователя"
                            rules={[
                                {
                                    required: true,
                                    message : "Человек не может быть пустыми"
                                }
                            ]}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                defaultValue={proguser===undefined?[]:proguser.peopleId}
                                options={peopleList?.map((people) => {
                                    return {
                                        label: people.peopleName + people.peopleLastName + people.MiddlepeopleName,
                                        value: people.peopleId
                                    }
                                })}
                            />
                        </Form.Item>
                </Form>
            </Modal>
            <Table 
                dataSource={progUserList} 
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.progUserId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.progUserId) 
                    },
                })}/>
        </div>
    )
}