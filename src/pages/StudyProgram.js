import { Button, Modal, Table, Form, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';

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

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'studyProgramId',
    from:'studyProgram'
}

const GridDataOptionTeacher = {
    namedFilters:[
        {
            name:"capClassId", 
            value: 1
        }
    ],
    rowCount:10,
    page:1,
    orderBy:'peopleId',
    from:'people'
}

const GridDataOptionAssistant = {
    namedFilters:[
        {
            name:"capClassId", 
            value: 11
        }
    ],
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
    const [studyProgram, setStudyProgram] = useState()
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false)
    const [form] = useForm()

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    
    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    useEffect(() => {
        if(studyProgramList===undefined){
            requestToApi.post("/v1/apps/dnk/objects/studyprogram/getlist", GridDataOption)
            .then(data => setStudyProgramList(data));
        }
    })

    function reload(){
        requestToApi.post("/v1/apps/dnk/objects/studyprogram/getlist", GridDataOption)
            .then(data => setStudyProgramList(data));
        requestToApi.post("/v1/apps/dnk/objects/people/getlist", GridDataOptionTeacher)
            .then(data => setTeacherList(data));
        requestToApi.post("/v1/apps/dnk/objects/people/getlist", GridDataOptionAssistant)
            .then(data => setAssistantList(data));
            requestToApi.post("/v1/apps/dnk/refbooks/direction/getlist", GridDataOptionAssistant)
            .then(data => setDirectionList(data));
    }

    function cancel(){
        setShow(false)
        setStudyProgram(undefined)
    }

    function add(){
        requestToApi.post("/v1/apps/dnk/objects/studyprogram/get", null)
            .then(data => {
                setStudyProgram(data)
                setShow(true)
            });
        setTimeout(() => {
            form.resetFields() 
        }, 50);
    } 

    function edit(id){
        requestToApi.post("/v1/apps/dnk/objects/studyprogram/get", id)
            .then(data => {
                setStudyProgram(data) 
                setShow(true)
            });
            setTimeout(() => {
                form.resetFields() 
            }, 50);
    }

    function submit(){
        requestToApi.post("/v1/apps/dnk/objects/studyprogram/save", studyProgram)
        setTimeout(() => {
            reload()
        }, 500);
        setShow(false)
        setStudyProgram(undefined)
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/objects/studyprogram/delete", selectedRowKeys)
        setTimeout(() => {
            reload()
        }, 50);
    }

    return(
        <div>
            <div>
                <h1>Программы обучения</h1>
                <div style={{position: 'relative', left:'85%' }}>
                    <Button onClick={deleteRows}>Удалить</Button>
                    <Button onClick={reload}>Обновить</Button>
                    <Button onClick={add}>Добавить</Button>
                </div>
            </div>
            <Modal open = {show}
            title="Изменение программы обучения" 
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
                    initialValues={studyProgram}
                    name="formRegistry"
                    style={{ padding: 20 }}>
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
                            onChange={(event) => {
                                studyProgram.studyProgramName = event.target.value
                            }}
                            placeholder="Название программы обучения" 
                            value={studyProgram===undefined?'':studyProgram.studyProgramName}/>
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
                            onChange={(event) => {
                                studyProgram.documentRealNumber = event.target.value
                            }}
                            placeholder="Номер документа с программой обучения" 
                            value={studyProgram===undefined?'':studyProgram.documentRealNumber}/>
                        </Form.Item>
                        <Form.Item
                            name="direction"
                            label="Направление"
                            rules={[
                                {
                                    required: true,
                                    message : "Направление программы обучения не может быть пустыми"
                                }
                            ]}>
                            <Select
                                style={{ width: '100%' }}
                                defaultValue={studyProgram===undefined?{}:{value:studyProgram.directionId, label:studyProgram.directionName}}
                                options={directionList.map((direction) => {
                                    return {
                                        label: direction.directionName,
                                        value: direction.directionId
                                    }
                                })}
                                onChange={(value) => {
                                    studyProgram.directionId = value
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="teacher"
                            label="Преподаватель"
                            rules={[
                                {
                                    required: true,
                                    message : "Преподаватель программы обучения не может отсутствовать"
                                }
                            ]}>
                            <Select
                                style={{ width: '100%' }}
                                defaultValue={studyProgram===undefined?{}:{value:studyProgram.teacherId, label:studyProgram.teacherName}}
                                options={teacherList.map((people) => {
                                    return {
                                        label: people.peopleName,
                                        value: people.peopleId
                                    }
                                })}
                                onChange={(value) => {
                                    studyProgram.teacherId = value
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="assistant"
                            label="Ассистент">
                            <Select
                                style={{ width: '100%' }}
                                defaultValue={studyProgram===undefined?{value:undefined, label:undefined}:{value:studyProgram.assistantId, label:studyProgram.assistantName}}
                                options={assistantList.map((people) => {
                                    return {
                                        label: people.peopleName,
                                        value: people.peopleId
                                    }
                                })}
                                onChange={(value) => {
                                    studyProgram.assistantId = value
                                }}
                            />
                        </Form.Item>
                </Form>
            </Modal>
            <Table 
                dataSource={studyProgramList} 
                columns={columns}
                rowSelection={rowSelection}
                rowKey={(record) => record.studyProgramId}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.studyProgramId) 
                    },
                })}/>
        </div>
    )
}