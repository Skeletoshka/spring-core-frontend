import { Button, Modal, Table, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';

const columns = [
    {
        title:'Имя роли',
        dataIndex:'accessRoleName',
        key:'accessRoleName'
    },
    {
        title:'Имя роли',
        dataIndex:'accessRoleFullName',
        key:'accessRoleFullName'
    }
]

const GridDataOption = {
    rowCount:10,
    page:1,
    orderBy:'accessRoleId',
    from:'accessrole'
}

export default function AccessRole(){

    const [accessRoleList, setAccessRoleList] = useState()
    const [accessRole, setAccessRole] = useState()
    const [show, setShow] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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
        setAccessRole(undefined)
    }

    useEffect(() => {
        if(accessRoleList===undefined){
            requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOption)
            .then(data => setAccessRoleList(data));
        }
    })

    function reload(){
        requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOption)
            .then(data => setAccessRoleList(data));
    }

    function add(){
        requestToApi.post("/v1/apps/refbooks/accessrole/get", null)
            .then(data => {
                setAccessRole(data)
                setShow(true)
            });
        setTimeout(() => {
            form.resetFields() 
        }, 50);
    }

    function edit(id){
        requestToApi.post("/v1/apps/refbooks/accessrole/get", id)
            .then(data => {
                setAccessRole(data) 
                setShow(true)
            });
            setTimeout(() => {
                form.resetFields() 
            }, 50);
    }

    function submit(){
        requestToApi.post("/v1/apps/refbooks/accessrole/save", accessRole)
        setTimeout(() => {
            reload()
        }, 500);
        setShow(false)
        setAccessRole(undefined)
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/refbooks/accessrole/delete", selectedRowKeys)
        setTimeout(() => {
            reload()
        }, 50);
    }

    return(
        <div>
            <div>
                <h1>Роли</h1>
                <div style={{position: 'relative', left:'85%' }}>
                    <Button onClick={deleteRows}>Удалить</Button>
                    <Button onClick={reload}>Обновить</Button>
                    <Button onClick={add}>Добавить</Button>
                </div>
            </div>
            <Modal open = {show}
            title="Изменение роли" 
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
                    initialValues={accessRole}
                    name="formRegistry"
                    style={{ padding: 20 }}>
                        <Form.Item
                            name="accessRoleName"
                            label="Имя роли"
                            rules={[
                                {
                                    required: true,
                                    message: "Имя роли не может быть пустым"
                                }
                            ]}>
                            <Input name="accessRoleName" 
                            onChange={(event) => {
                                accessRole.accessRoleName = event.target.value
                            }}
                            placeholder="Имя роли" 
                            value={accessRole===undefined?'':accessRole.accessRoleName}/>
                        </Form.Item>
                        <Form.Item
                            name="accessRoleFullName"
                            label="Полное имя роли"
                            rules={[
                                {
                                    required: true,
                                    message: "Полное имя роли не может быть пустым"
                                }
                            ]}>
                            <Input name="accessRoleFullName" 
                            onChange={(event) => {
                                accessRole.accessRoleFullName = event.target.value
                            }}
                            placeholder="Полное имя роли" 
                            value={accessRole===undefined?'':accessRole.accessRoleFullName}/>
                        </Form.Item>
                </Form>
            </Modal>
            <Table 
                dataSource={accessRoleList} 
                columns={columns}
                rowSelection={rowSelection}
                rowKey={(record) => record.accessRoleId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.accessRoleId) 
                    },
                })}/>
        </div>
    )
}