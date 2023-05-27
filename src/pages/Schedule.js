import {Button, Modal, Table, Form, Input, DatePicker, Select, Checkbox} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import Dayjs from "dayjs";

const peoples = []

const formTableColumns = [
    {
        title: "ФИО ученика",
        dataIndex: "people",
        key: "people",
        render: (_, entity) => {
            return entity.peopleLastName + " " + entity.peopleName.substring(0, 1) + ". " + entity.peopleMiddleName.substring(0, 1) + ". "
        }
    },
    {
        title: "Наличие",
        dataIndex: "attendancePresenceFlag",
        key: "attendancePresenceFlag",
        render: (_, entity) => <Checkbox onClick={() => peoples.push(entity.peopleId)}/>
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'scheduleId'
}

export default function Schedule() {
    const [scheduleList, setScheduleList] = useState([])
    const [studyProgramList, setStudyProgramList] = useState([])
    const [peopleList, setPeopleList] = useState([])
    const [workGroupList, setWorkGroupList] = useState([])
    const [id, setId] = useState()
    const [loading, setLoading] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false)
    const [showAttendance, setShowAttendance] = useState(false)
    const [form] = useForm()
    const [formAttendance] = useForm()
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

    const columns = [
        {
            title: "Наименование предмета",
            dataIndex: "studyProgramName",
            key: "studyProgramName",
            onCell: record => {
                return {
                    onClick: () => {
                        edit(record.scheduleId)
                    }
                }
            }
        },
        {
            title: "Наименование учебной группы",
            dataIndex: "workGroupName",
            key: "workGroupName",
            onCell: record => {
                return {
                    onClick: () => {
                        edit(record.scheduleId)
                    }
                }
            }
        },
        {
            title: "Место проведения",
            dataIndex: "schedulePlace",
            key: "schedulePlace",
            onCell: record => {
                return {
                    onClick: () => {
                        edit(record.scheduleId)
                    }
                }
            }
        },
        {
            title: "Дата проведения",
            dataIndex: "scheduleDate",
            key: "scheduleDate",
            render: (peopleDateBirth) => {
                return new Date(peopleDateBirth).toLocaleString()
            },
            onCell: record => {
                return {
                    onClick: () => {
                        edit(record.scheduleId)
                    }
                }
            }
        },
        {
            title: "Посещаемость",
            dataIndex: "attendance",
            key: "attendance",
            render: (_, entity) => {
                return <Button onClick={() => editAttendance(entity.scheduleId)}>Заполнить посещаемость</Button>
            }
        }
    ]

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    useEffect(() => {
        if(loading) {
            requestToApi.post("/v1/apps/dnk/objects/schedule/getlist", GridDataOption)
                .then(data => {
                    setScheduleList(data.result)
                    pagination.total = data.allRowCount;
                    pagination.current = data.page;
                    pagination.pageSize = data.rowCount;
                })
                .finally(() => {
                    setLoading(false)
                });
        }
    }, [loading])

    function reload(){
        setLoading(true)
    }

    function cancel(){
        setShow(false)
    }

    function cancelAttendance(){
        setShowAttendance(false)
    }

    function edit(id){
        requestToApi.post("/v1/apps/dnk/objects/schedule/get", id)
            .then(data => {
                setId(data.scheduleId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: key==="scheduleDate"?Dayjs(data[key]):data[key],
                })))
                setShow(true)
            });
    }

    function editAttendance(id){
        peoples.fill({}, 0)
        cancel()
        let workGroupId = scheduleList?.map(schedule => {
            if (schedule.scheduleId === id){
                return schedule.workGroupId
            }
        }).pop()
        if(workGroupId === undefined){
            workGroupId = scheduleList?.map(schedule => {
                if (schedule.scheduleId === id){
                    return schedule.workGroupId
                }
            }).at(0)
        }
        requestToApi.post("/v1/apps/dnk/objects/people/getlist", {
            namedFilters: [{
                name: "workGroupId",
                value: workGroupId
            }],
            rowCount: 100,
            page: 1,
            orderBy: 'peopleLastName'
        })
            .then(data => {
                setPeopleList(data.result)
            })
        setShowAttendance(true)
        cancel()
    }

    function submit(){
        form.validateFields().then((values) => {
            values.scheduleId = id;
            values.scheduleDate = new Date(values.scheduleDate).getTime()
            requestToApi.post("/v1/apps/dnk/objects/schedule/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function submitAttendance(){
        formAttendance.validateFields().then((values) => {
            console.log(values)
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/objects/schedule/delete", selectedRowKeys)
            .then(() => {
                reload()
            })
    }

    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={() => edit(null)}>Добавить</Button>
    ]

    return (
        <div>
            <PageHeader
                title={"Расписание"}
                buttons={buttons}
            />
            <Modal open={showAttendance}
                   title="Изменение посещаемости"
                   onCancel={cancelAttendance}
                   centered={true}
                   footer={[
                       <Button onClick={submitAttendance}>
                           Добавить
                       </Button>,
                       <Button onClick={cancelAttendance}>
                           Назад
                       </Button>
                   ]}>
                <Form
                    form={formAttendance}
                    layout={"vertical"}
                    name="formRegistry"
                    style={{padding: 20}}>
                    <Form.Item
                        name="attendance"
                        label="Посещаемость">
                        <Table
                            dataSource={peopleList}
                            columns={formTableColumns}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal open={show}
                   title="Изменение расписания"
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
                        name="studyProgramId"
                        label="Программа обучения"
                        rules={[
                            {
                                required: true,
                                message: "Программа обучения не может быть пустой"
                            }
                        ]}>
                        <Select
                            name="studyProgramId"
                            placeholder="Программа обучения"
                            onClick={() => {
                                if(studyProgramList.length === 0) {
                                    requestToApi.post("/v1/apps/dnk/objects/studyprogram/getlist", {
                                        namedFilters:[],
                                        rowCount:100,
                                        page:1,
                                        orderBy:'studyProgramId'
                                    })
                                        .then(data => {
                                            setStudyProgramList(data.result)
                                        });
                                }
                            }}
                            options={studyProgramList?.map((studyProgram) => {
                                return {
                                    label: studyProgram.studyProgramName,
                                    value: studyProgram.studyProgramId
                                }
                            })}/>
                    </Form.Item>
                    <Form.Item
                        name="workGroupId"
                        label="Учебная группа"
                        rules={[
                            {
                                required: true,
                                message: "Учебная группа не может быть пустой"
                            }
                        ]}>
                        <Select
                            name="workGroupId"
                            placeholder="Учебная группа"
                            onClick={() => {
                                if(workGroupList.length === 0) {
                                    requestToApi.post("/v1/apps/dnk/objects/workgroup/getlist", {
                                        namedFilters:[],
                                        rowCount:100,
                                        page:1,
                                        orderBy:'workGroupId'
                                    })
                                        .then(data => {
                                            setWorkGroupList(data.result)
                                        });
                                }
                            }}
                            options={workGroupList?.map((workGroup) => {
                                return {
                                    label: workGroup.workGroupName,
                                    value: workGroup.workGroupId
                                }
                            })}/>
                    </Form.Item>
                    <Form.Item
                        name="scheduleDate"
                        label="Дата проведения занятия"
                        rules={[
                            {
                                required: true,
                                message: "Дата проведения занятия не может быть пустой"
                            }
                        ]}>
                        <DatePicker name="scheduleDate" showTime={true}/>
                    </Form.Item>
                    <Form.Item
                        name="schedulePlace"
                        label="Кабинет">
                        <Input name="schedulePlace"
                               placeholder="Кабинет"/>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={scheduleList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.scheduleId}
                pagination={pagination}/>
        </div>
    )

}