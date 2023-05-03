import {Button, Modal, Table, Form, Input, DatePicker, Select, Checkbox} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import Dayjs from "dayjs";
import {CheckOutlined} from "@ant-design/icons";

const columns = [
    {
        title: "Наименование предмета",
        dataIndex: "studyProgramName",
        key: "studyProgramName"
    },
    {
        title: "Наименование учебной группы",
        dataIndex: "workGroupName",
        key: "workGroupName"
    },
    {
        title: "Дата проведения",
        dataIndex: "scheduleDate",
        key: "scheduleDate",
        render: (peopleDateBirth) => {
            return new Date(peopleDateBirth).toLocaleString()
        }
    },
    {
        title: "Человек",
        dataIndex: "people",
        key: "people",
        render: (_, entity) => {
            return entity.peopleLastName + " " + entity.peopleName.substring(0, 1) + ". " + entity.peopleMiddleName.substring(0, 1) + "."
        }
    },
    {
        title:'Был/нет',
        dataIndex:'attendancePresenceFlag',
        key:'attendancePresenceFlag',
        render: (attendancePresenceFlag) => {
            if (attendancePresenceFlag===1){
                return <span><CheckOutlined/></span>
            }
        }
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'attendanceId'
}

export default function Attendance() {
    const [attendanceList, setAttendanceList] = useState([])
    const [scheduleList, setScheduleList] = useState([])
    const [peopleList, setPeopleList] = useState([])
    const [id, setId] = useState()
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

    useEffect(() => {
        requestToApi.post("/v1/apps/dnk/objects/attendance/getlist", GridDataOption)
            .then(data => {
                setAttendanceList(data.result)
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
        requestToApi.post("/v1/apps/dnk/objects/attendance/get", id)
            .then(data => {
                setId(data.attendanceId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.attendanceId = id;
            values.attendancePresenceFlag = values.attendancePresenceFlag?1:0
            requestToApi.post("/v1/apps/dnk/objects/attendance/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/objects/attendance/delete", selectedRowKeys)
            .then(data => {
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
                title={"Посещаемость"}
                buttons={buttons}
            />
            <Modal open={show}
                   title="Изменение посещаемости"
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
                        name="scheduleId"
                        label="Занятие"
                        rules={[
                            {
                                required: true,
                                message: "Занятие не может быть пустым"
                            }
                        ]}>
                        <Select
                            name="scheduleId"
                            placeholder="Занятие"
                            onClick={() => {
                                if(scheduleList.length === 0) {
                                    requestToApi.post("/v1/apps/dnk/objects/schedule/getlist", {
                                        namedFilters:[],
                                        rowCount:100,
                                        page:1,
                                        orderBy:'scheduleId'
                                    })
                                        .then(data => {
                                            setScheduleList(data.result)
                                        });
                                }
                            }}
                            options={scheduleList?.map((schedule) => {
                                return {
                                    label: schedule.studyProgramName + " " + new Date(schedule.scheduleDate).toLocaleString(),
                                    value: schedule.scheduleId
                                }
                            })}/>
                    </Form.Item>
                    <Form.Item
                        name="peopleId"
                        label="Человек"
                        rules={[
                            {
                                required: true,
                                message: "Человек не может быть пустой"
                            }
                        ]}>
                        <Select
                            name="peopleId"
                            placeholder="Человек"
                            onClick={() => {
                                if(peopleList.length === 0) {
                                    requestToApi.post("/v1/apps/dnk/objects/people/getlist", {
                                        namedFilters:[],
                                        rowCount:100,
                                        page:1,
                                        orderBy:'peopleId'
                                    })
                                        .then(data => {
                                            setPeopleList(data.result)
                                        });
                                }
                            }}
                            options={peopleList?.map((people) => {
                                return {
                                    label: people.peopleLastName + " " + people.peopleName.substring(0, 1)
                                        + ". " + people.peopleMiddleName.substring(0, 1) + ".",
                                    value: people.peopleId
                                }
                            })}/>
                    </Form.Item>
                    <Form.Item
                        name="attendancePresenceFlag"
                        label="Наличие на занятии"
                        valuePropName="checked"
                        rules={[
                            {
                                required: true,
                                message: "Наличие на занятии не может быть пустой"
                            }
                        ]}>
                        <Checkbox
                            name="attendancePresenceFlag">
                            Был</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={attendanceList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.attendanceId}
                pagination={pagination}
                onRow={(record) => ({
                    onClick: () => {
                        edit(record.attendanceId)
                    },
                })}/>
        </div>
    )

}