import { Button, Modal, Table, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import {CheckOutlined} from '@ant-design/icons'
import PageHeader from "../components/PageHeader";
import CheckBox from '../components/Checkbox';

const columns = [
    {
        title:'Имя роли',
        dataIndex:'accessRoleName',
        key:'accessRoleName'
    },
    {
        title:'Полное имя роли',
        dataIndex:'accessRoleFullName',
        key:'accessRoleFullName'
    },
    {
        title: 'Видимость',
        dataIndex: 'accessRoleVisible',
        key: 'accessRoleVisible',
        render: (accessRoleVisible) => {
            if (accessRoleVisible===1){
                return <span><CheckOutlined/></span>
            }
        }
    }
]

const GridDataOption = {
    rowCount:10,
    page:1,
    orderBy:'accessRoleId'
}

export default function AccessRole(){

    const [accessRoleList, setAccessRoleList] = useState();
    const [id, setId] = useState();
    const [show, setShow] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = useForm()
    const [pagination] = useState({
        current: 2,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total)=>{
            return "Всего " + total
        },
        onChange: (page, pageSize) => {
            GridDataOption.page = page;
            GridDataOption.rowCount = pageSize;
            reload();
        }
    })

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
        if(loading) {
            requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOption)
                .then(data => {
                    setAccessRoleList(data.result)
                    pagination.total = data.allRowCount;
                    pagination.current = data.page;
                    pagination.pageSize = data.rowCount;
                })
                .finally(() => setLoading(false));
        }
    }, [loading])

    function reload(){
        setLoading(true)
    }

    function edit(id){
        requestToApi.post("/v1/apps/refbooks/accessrole/get", id)
            .then(data => {
                setId(data.accessRoleId)
                form.setFields(Object.keys(data).map((key) => (
                    {
                        name: key,
                        value: data[key],
                    }
                )))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.accessRoleId = id;
            console.log(values)
            values.accessRoleVisible = values.accessRoleVisible.target.checked?1:0
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
                    key={id}
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
                            label="Полное имя роли">
                            <Input name="accessRoleFullName"
                            placeholder="Полное имя роли" />
                        </Form.Item>
                        <Form.Item
                            name="accessRoleVisible"
                            label="Видимость роли">
                            <CheckBox 
                                name="accessRoleVisible"
                                placeholder="Видимость роли"
                                rules={[
                                    {
                                        required: true,
                                        message: "Видимость роли не может быть пустой"
                                    }
                                ]}
                                text="Видна ли роль пользователю"
                                onChange={(e) => {console.log(e.target.checked)}}
                            />
                        </Form.Item>
                </Form>
            </Modal>
            <Table 
                dataSource={accessRoleList} 
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                pagination={pagination}
                rowKey={(record) => record.accessRoleId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.accessRoleId) 
                    },
                })}/>
        </div>
    )
}