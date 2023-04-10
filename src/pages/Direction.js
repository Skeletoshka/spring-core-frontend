import { Button, Modal, Table, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";

const columns = [
    {
        title: "Наименование направления",
        dataIndex: "directionName",
        key: "directionName"
    },
    {
        title: "Описание направления",
        dataIndex: "directionDesc",
        key: "directionDesc"
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'directionId',
    from:'direction'
}

export default function Direction() {
    const [directionList, setDirectionList] = useState([])
    const [direction, setDirection] = useState()
    const [loading, setLoading] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false)
    const [form] = useForm()

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    
    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    useEffect(() => {
        requestToApi.post("/v1/apps/dnk/refbooks/direction/getlist", GridDataOption)
        .then(data => {
            setDirectionList(data)
            setLoading(false);
        });
    }, [loading])

    function reload(){
        setLoading(true)
    }

    function cancel(){
        setShow(false)
        setDirection(undefined)
    }

    function add(){
        requestToApi.post("/v1/apps/dnk/refbooks/direction/get", null)
            .then(data => {
                setDirection(data)
                setShow(true)
                form.resetFields()
            });
    } 

    function edit(id){
        requestToApi.post("/v1/apps/dnk/refbooks/direction/get", id)
            .then(data => {
                setDirection(data) 
                setShow(true)
                form.resetFields()
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            requestToApi.post("/v1/apps/dnk/refbooks/direction/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                    setDirection(undefined)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/refbooks/direction/delete", selectedRowKeys)
            .then(data => {
                reload()
            })
    }
    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={add}>Добавить</Button>
    ]

    return (
        <div>
            <PageHeader
                title={"Направления"}
                buttons={buttons}
            />
            <Modal open={show}
                   title="Изменение направления"
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
                    initialValues={direction}
                    name="formRegistry"
                    style={{padding: 20}}>
                    <Form.Item
                        name="directionName"
                        label="Название направления"
                        rules={[
                            {
                                required: true,
                                message: "Название направления не может быть пустым"
                            }
                        ]}>
                        <Input name="directionName"
                               placeholder="Название программы обучения"
                               value={direction === undefined ? '' : direction.directionName}/>
                    </Form.Item>
                    <Form.Item
                        name="directionDesc"
                        label="Описание направления">
                        <Input name="directionDesc"
                               placeholder="Описание направления"
                               value={direction === undefined ? '' : direction.directionDesc}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={directionList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.directionId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.directionId)
                    },
                })}/>
        </div>
    )

}