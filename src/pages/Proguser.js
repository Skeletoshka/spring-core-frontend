import { Button, Modal, Table, Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';

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
    orderBy:'proguser_id',
    from:'proguser'
}

export default function Proguser(){

    const [progUserList, setProgUserList] = useState()
    const [proguser, setProgUser] = useState()
    const [show, setShow] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [accessRoleList, setAccessRoleList] = useState([])
    const [form] = useForm()

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
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
        if(progUserList===undefined){
            requestToApi.post("/v1/apps/objects/proguser/getlist", GridDataOption)
            .then(data => setProgUserList(data));
        }
    })

    function reload(){
        requestToApi.post("/v1/apps/objects/proguser/getlist", GridDataOption)
            .then(data => setProgUserList(data));
    }

    function add(){
        requestToApi.post("/v1/apps/objects/proguser/get", null)
        .then(data => {
            setProgUser(data)
            setShow(true)
        });
        requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOption)
        .then(data => setAccessRoleList(data));
        setTimeout(() => {
            form.resetFields() 
        }, 50);
    }

    function edit(id){
        requestToApi.post("/v1/apps/objects/proguser/get", id)
        .then(data => {
            setProgUser(data) 
            setShow(true)
        });
        requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOption)
        .then(data => setAccessRoleList(data));
        setTimeout(() => {
            form.resetFields() 
        }, 50);
    }

    function submit(){
        requestToApi.post("/v1/apps/objects/proguser/save", proguser)
        setTimeout(() => {
            reload()
        }, 500);
        setShow(false)
        setProgUser(undefined)
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/objects/proguser/delete", selectedRowKeys)
        setTimeout(() => {
            reload()
        }, 50);
    }
    
    function changeRoles(value){
        proguser.accessRoleViews=value?.map(val => {
            return {
                accessRoleId: val
            }
        })
    }

    return(
        <div>
            <div>
                <h1>Пользователи</h1>
                <div style={{position: 'relative', left:'85%' }}>
                    <Button onClick={deleteRows}>Удалить</Button>
                    <Button onClick={reload}>Обновить</Button>
                    <Button onClick={add}>Добавить</Button>
                </div>
            </div>
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
                            onChange={(event) => {
                                proguser.progUserName = event.target.value
                            }}
                            ref={(input) => show&&input&&input.focus}
                            placeholder="Имя пользователя" 
                            value={proguser===undefined?'':proguser.progUserName}/>
                        </Form.Item>
                        <Form.Item
                            name="progUserFullName"
                            label="Полное имя пользователя">
                            <Input name="fullusername" onChange={(event) => {
                                proguser.progUserFullName = event.target.value
                            }} placeholder="Полное имя пользователя" value={proguser===undefined?'':proguser.progUserFullName}/>
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
                                <Input name="progUserPassword" onChange={(event) => {
                                proguser.progUserPassword = event.target.value
                            }} placeholder="Пароль"/>
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
                                <Input name="progUserActive" onChange={(event) => {
                                proguser.progUserActive = event.target.value
                            }} placeholder="Активность пользователя" value={proguser===undefined?'':proguser.progUserActive}/>
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
                                onChange={changeRoles}
                            />
                        </Form.Item>
                </Form>
            </Modal>
            <Table 
                dataSource={progUserList} 
                columns={columns}
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