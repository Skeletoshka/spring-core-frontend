import { Button, Modal, Table, Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";

const columns = [
    {
        title: "Наименование программы обучения",
        dataIndex: "studyProgramName",
        key: "studyProgramName"
    },
    {
        title: "Направление",
        dataIndex: "directionName",
        key: "directionName"
    },
    {
        title: "Преподаватель",
        dataIndex: "teacher",
        key: "teacher",
        render: (_, entity) => {
            return entity.teacherLastName + " " + entity.teacherName.substring(0, 1) + ". " + entity.teacherMiddleName.substring(0, 1) + "."
        }
    }
]

if(localStorage.getItem("roles") === "Родитель"){
    columns.push({
        title: "Запись",
        dataIndex: "request",
        key: "request",
        render: (_, entity) => {
            return <Button onClick={() => signUp(entity.studyProgramId)}>Записаться на курс</Button>
        }
    })
}

function signUp(id) {
    
}

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'studyProgramId',
    from:'studyProgram'
}

export default function StudyProgram(){
    const [studyProgramList, setStudyProgramList] = useState([])
    const [directionList, setDirectionList] = useState([])
    const [assistantList, setAssistantList] = useState([])
    const [teacherList, setTeacherList] = useState([])
    const [id, setId] = useState()
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(true)
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

    useEffect(() => {
        requestToApi.post("/v1/apps/dnk/objects/studyprogram/getlist", GridDataOption)
            .then(data => {
                setStudyProgramList(data)
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

    function edit(id){
        requestToApi.post("/v1/apps/dnk/objects/studyprogram/get", id)
            .then(data => {
                setId(data.studyProgramId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.studyProgramId = id;
            requestToApi.post("/v1/apps/dnk/objects/studyprogram/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/objects/studyprogram/delete", selectedRowKeys)
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
                title={"Программы обучения"}
                buttons={buttons}
            />
            <Modal open = {show}
            title="Изменение программы обучения" 
            onCancel={cancel}
            centered={true}
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
                    name="formRegistry"
                    style={{padding: 20}}>
                        <Form.Item
                            name="studyProgramName"
                            label="Название программы обучения"
                            rules={[
                                {
                                    required: true,
                                    message: "Название программы обучения не может быть пустым"
                                }
                            ]}>
                            <Input name="studyProgramName"
                            placeholder="Название программы обучения"/>
                        </Form.Item>
                        <Form.Item
                            name="documentRealNumber"
                            label="Номер документа с программой обучения"
                            rules={[
                                {
                                    required: true,
                                    message: "Номер документа с программой обучения не может быть пустым"
                                }
                            ]}>
                            <Input name="documentRealNumber"
                            placeholder="Номер документа с программой обучения"/>
                        </Form.Item>
                        <Form.Item
                            name="directionId"
                            label="Направление"
                            rules={[
                                {
                                    required: true,
                                    message : "Направление программы обучения не может быть пустыми"
                                }
                            ]}>
                            <Select
                                style={{ width: '100%' }}
                                onClick={() => {
                                    if(directionList.length === 0) {
                                        requestToApi.post("/v1/apps/dnk/refbooks/direction/getlist", {
                                            namedFilters:[],
                                            rowCount:10,
                                            page:1,
                                            orderBy:'directionId'
                                        })
                                            .then(data => setDirectionList(data.result));
                                    }
                                }}
                                options={directionList.map((direction) => {
                                    return {
                                        label: direction.directionName,
                                        value: direction.directionId
                                    }
                                })}
                            />
                        </Form.Item>
                        <Form.Item
                            name="teacherId"
                            label="Преподаватель"
                            rules={[
                                {
                                    required: true,
                                    message : "Преподаватель программы обучения не может отсутствовать"
                                }
                            ]}>
                            <Select
                                style={{ width: '100%' }}
                                onClick={() => {
                                    if(teacherList.length === 0) {
                                        requestToApi.post("/v1/apps/dnk/objects/people/getlist", {
                                            namedFilters:[
                                                {
                                                    name:"capClassId",
                                                    value: 1
                                                }
                                            ],
                                            rowCount:10,
                                            page:1,
                                            orderBy:'peopleId'
                                        })
                                            .then(data => setTeacherList(data.result));
                                    }
                                }}
                                options={teacherList.map((people) => {
                                    return {
                                        label: people.peopleName,
                                        value: people.peopleId
                                    }
                                })}
                            />
                        </Form.Item>
                        <Form.Item
                            name="assistantId"
                            label="Ассистент">
                            <Select
                                style={{ width: '100%' }}
                                onClick={() => {
                                    if(assistantList.length === 0) {
                                        requestToApi.post("/v1/apps/dnk/objects/people/getlist", {
                                            namedFilters:[
                                                {
                                                    name:"capClassId",
                                                    value: 11
                                                }
                                            ],
                                            rowCount:10,
                                            page:1,
                                            orderBy:'studyProgramId'
                                        })
                                            .then(data => setAssistantList(data.result));
                                    }
                                }}
                                options={assistantList.map((people) => {
                                    return {
                                        label: people.peopleName,
                                        value: people.peopleId
                                    }
                                })}
                            />
                        </Form.Item>
                </Form>
            </Modal>
            <Table 
                dataSource={studyProgramList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                pagination={pagination}
                rowKey={(record) => record.studyProgramId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.studyProgramId) 
                    },
                })}/>
        </div>
    )
}