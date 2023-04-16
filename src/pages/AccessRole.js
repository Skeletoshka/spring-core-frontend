import { Button, Modal, Table, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";

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

    const [accessRoleList, setAccessRoleList] = useState();
    const [id, setId] = useState();
    const [show, setShow] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(true);
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
    }

    useEffect(() => {
        requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOption)
            .then(data => {
                setAccessRoleList(data)
                setLoading(false)
            });
    }, [loading])

    function reload(){
        setLoading(true)
    }

    function edit(id){
        requestToApi.post("/v1/apps/refbooks/accessrole/get", id)
            .then(data => {
                setId(data.accessRoleId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.accessRoleId = id;
            requestToApi.post("/v1/apps/refbooks/accessrole/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/refbooks/accessrole/delete", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={() => edit(null)}>Добавить</Button>
    ]

    return(
        <div>
            <PageHeader
                title={"Роли"}
                buttons={buttons}
            />
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
                    centered={true}
                    name="formRegistry"
                    style={{padding: 20}}>
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
                            placeholder="Имя роли"/>
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
                            placeholder="Полное имя роли" />
                        </Form.Item>
                </Form>
            </Modal>
            <Table 
                dataSource={accessRoleList} 
                columns={columns}
                loading={loading}
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