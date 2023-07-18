import { Button, Modal, Table, Form, Input, Checkbox} from 'antd';
import Select from '../components/SelectImpl';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import {CheckOutlined} from "@ant-design/icons";
import {useParams} from "react-router-dom";
const columns = [
    {
        title: "Наименование блока",
        dataIndex: "blockName",
        key: "blockName"
    },
    {
        title: "Описание блока",
        dataIndex: "blockDesc",
        key: "blockDesc"
    },
    {
        title:'Отображение блока',
        dataIndex:'blockVisible',
        key:'blockVisible',
        render: (blockVisible) => {
            if (blockVisible===1){
                return <span><CheckOutlined/></span>
            }
        }
    },
    {
        title:'Номер блока',
        dataIndex:'blockNum',
        key:'blockNum'
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'blockId'
}

const GridDataOptionCapClass = {
    namedFilters:[
        {name:"capClassTypeId", value:3}
    ],
    rowCount:10,
    page:1,
    orderBy:'capClassId',
    from:'capClass'
}

export default function Block() {
    const [blockList, setBlockList] = useState([])
    const [studyCaseList, setStudyCaseList] = useState([])
    const [capClassList, setCapClassList] = useState([])
    const [entityId, setId] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false)
    const [form] = useForm()
    const [pagination, setPagination] = useState({
        current: 2,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => {
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

    const {id} = useParams()

    useEffect(() => {
        GridDataOption.namedFilters.push({name: "studyCaseId", value: parseInt(id)})
        requestToApi.post("/v1/apps/dnk/studyprogram/block/getlist", GridDataOption)
            .then(data => {
                setBlockList(data.result)
                pagination.total = data.allRowCount;
                pagination.current = data.page;
                pagination.pageSize = data.rowCount;
            })
            .finally(() => setLoading(false));
    }, [loading])

    function reload(){
        setLoading(true)
    }

    function cancel(){
        setShow(false)
    }


    function edit(entityId){
        requestToApi.post("/v1/apps/dnk/studyprogram/block/get", entityId)
            .then(data => {
                setId(data.blockId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.blockId = entityId
            values.studyCaseId = id
            values.blockVisible = values.blockVisible?1:0;
            requestToApi.post("/v1/apps/dnk/studyprogram/block/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/studyprogram/block/delete", selectedRowKeys)
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
                title = {"Блоки"}
                buttons = {buttons}
            />
            <Modal open = {show}
                   title = "Изменение блока раздела"
                   onCancel = {cancel}
                   centered = {true}
                   footer = {[
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
                    name="formRegistry"
                    style={{padding: 20}}>
                    <Form.Item
                        name = "blockName"
                        label = "Название блока"
                        rules = {[
                            {
                                required: true,
                                message: "Название блока не может быть пустым"
                            }
                        ]}>
                        <Input name="blockName"
                               placeholder="Название блока"/>

                    </Form.Item>
                    <Form.Item
                        name = "blockDesc"
                        label = "Описание блока">
                        <Input name = "blockDesc"
                               placeholder = "Описание блока"/>
                    </Form.Item>
                    <Form.Item
                        name = "capClassId"
                        label = "Тип блока"
                        rules = {[
                            {
                                required: true,
                                message: "Классификатор Блока не может быть пустым"
                            }
                        ]}>
                        <Select
                            name = "capClassId"
                            style={{ width: '100%' }}
                            onClick={() => {
                                if(capClassList.length === 0) {
                                    requestToApi.post("/v1/apps/refbooks/capclass/getlist", GridDataOptionCapClass)
                                        .then(data => {
                                            setCapClassList(data)
                                        });
                                }
                            }}
                            options={capClassList?.map((capClass) => {
                                return {
                                    label: capClass.capClassName,
                                    value: capClass.capClassId
                                }
                            })}/>
                    </Form.Item>
                    <Form.Item
                        name = "blockNum"
                        label = "Номер блока"
                        rules = {[
                            {
                                required: true,
                                message: "Номер блока не может быть пустым"
                            }
                        ]}>
                        <Input name="blockNum"
                               placeholder="Номер блока"/>
                    </Form.Item>
                    <Form.Item
                        name="blockVisible"
                        label="Отображение блока"
                        valuePropName="checked"
                        rules={[
                            {
                                required: true,
                                message: "Поле отображение блока не может быть пустым"
                            }
                        ]}>
                        <Checkbox
                            name="blockVisible">
                            Отобразить</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={blockList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.blockId}
                pagination={pagination}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.blockId)
                    },
                })}
            />

        </div>
    )
}
