import { Button, Modal, Table, Form, Input, Checkbox, Select} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import {CheckOutlined} from "@ant-design/icons";
import {Link, useParams} from "react-router-dom";
const columns = [
    {
        title: "Наименование раздела обучения",
        dataIndex: "studyCaseName",
        key: "studyCaseName"
    },
    {
        title: "Описание раздела обучения",
        dataIndex: "studyCaseDesc",
        key: "studyCaseDesc"
    },
    {
        title:'Отображение раздела',
        dataIndex:'studyCaseVisible',
        key:'studyCaseVisible',
        render: (studyCaseVisible) => {
            if (studyCaseVisible===1){
                return <span><CheckOutlined/></span>
            }
        }
    },
    {
        title:'Номер раздела',
        dataIndex:'studyCaseNum',
        key:'studyCaseNum'
    },
    {
        title: "Блоки",
        dataIndex: "block",
        key: "block",
        render: (_, entity) => {
            return <Link to={'/lk/studyprogram/studycase/block/' + entity.studyCaseId}>Просмотреть блоки</Link>
        }
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'studyCaseId'
}



export default function StudyCase(){
    const [studyCaseList, setStudyCaseList] = useState([])
    const [studyProgramList, setStudyProgramList] = useState([])
    const [entityId, setId] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false)
    const [form] = useForm()
    const [pagination, setPagination] = useState({
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

    const {id} = useParams()

    useEffect(() => {
        GridDataOption.namedFilters.push({name: "studyProgramId", value: parseInt(id)})
        requestToApi.post("/v1/apps/dnk/studyprogram/studycase/getlist", GridDataOption)
            .then(data => {
                setStudyCaseList(data.result)
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
        requestToApi.post("/v1/apps/dnk/studyprogram/studycase/get", entityId)
            .then(data => {
                setId(data.studyCaseId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.studyCaseId = entityId
            values.studyProgramId = id
            values.studyCaseVisible = values.studyCaseVisible?1:0;
            requestToApi.post("/v1/apps/dnk/studyprogram/studycase/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/studyprogram/studycase/delete", selectedRowKeys)
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
                title = {"Разделы"}
                buttons = {buttons}
            />
            <Modal open = {show}
                   title = "Изменение раздела"
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
                        name = "studyCaseName"
                        label = "Название раздела"
                        rules = {[
                            {
                                required: true,
                                message: "Название раздела не может быть пустым"
                            }
                        ]}>
                        <Input name="studyCaseName"
                               placeholder="Название раздела"/>

                    </Form.Item>
                    <Form.Item
                        name = "studyCaseDesc"
                        label = "Описание раздела">
                        <Input name = "studyCaseDesc"
                               placeholder = "Описание раздела"/>
                    </Form.Item>
                    <Form.Item
                        name = "studyCaseNum"
                        label = "Номер раздела"
                        rules = {[
                            {
                                required: true,
                                message: "Номер раздела не может быть пустым"
                            }
                        ]}>
                        <Input name="studyCaseNum"
                               placeholder="Номер раздела"/>
                    </Form.Item>
                    <Form.Item
                        name="studyCaseVisible"
                        label="Отображение раздела"
                        valuePropName="checked"
                        rules={[
                            {
                                required: true,
                                message: "Поле для отображения раздела не может быть пустым"
                            }
                        ]}>
                        <Checkbox
                            name="studyCaseVisible">
                            Отобразить</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={studyCaseList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.studyCaseId}
                pagination={pagination}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.studyCaseId)
                    },
                })}
            />

        </div>
    )
}
