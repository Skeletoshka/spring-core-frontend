import {Button, Modal, Table, Form, Input, DatePicker, Checkbox } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import Dayjs from "dayjs";
import SelectImpl from '../components/SelectImpl';

let peoples;

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
        render: (_, entity) => <Checkbox defaultChecked={entity.attendancePresenceFlag === 1}
                                         onChange={(event) => {
                                             if (event.target.checked) {
                                                 entity.attendancePresenceFlag = 1
                                             } else {
                                                 entity.attendancePresenceFlag = 0
                                             }
                                         }}
                                         key={entity.peopleId}
        />
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
    const [spList, setSpList] = useState([])
    const [teacherList, setTeacherList] = useState([])
    const [workgroupList, setWorkgroupList] = useState([])
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
    const { RangePicker } = DatePicker;
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

    let filters = [
        <SelectImpl 
            placeholder={"Преподаватель"}
            className={"filter"}
            key={"teacher"}
            onClick={() => {
                if (teacherList.length === 0){
                    requestToApi.post("/v1/apps/dnk/objects/people/getlist", {
                        namedFilters:[],
                        rowCount:100,
                        page:1,
                        orderBy:'peopleSecondName'
                    })
                        .then((data) => {
                            setTeacherList(data.result)
                        })
                }
            }}
            onChange={(value) => {
                if(value !== undefined){
                    let existIndex = GridDataOption.namedFilters.findIndex(nf => nf.name === "teacherId");
                    if(existIndex !== -1){
                        GridDataOption.namedFilters.splice(existIndex, 1, {name:"teacherId", value: value});
                    }else{
                        GridDataOption.namedFilters.push({name:"teacherId", value: value});
                    }
                }else{
                    GridDataOption.namedFilters = GridDataOption.namedFilters.filter(nf => nf.name !== "teacherId")
                }
                reload()
            }}
            options={teacherList?.map((teacher) => {
                return {
                    label: teacher.peopleLastName + " " + teacher.peopleName.substring(0, 1) + ". " + teacher.peopleMiddleName.substring(0, 1) + ". ",
                    value: teacher.peopleId
                }
            })}/>,
        <SelectImpl 
            placeholder={"Программа обучения"}
            className={"filter"}
            key={"studyProgram"}
            onClick={() => {
                if (spList.length === 0){
                    requestToApi.post("/v1/apps/dnk/objects/studyprogram/getlist", {
                        namedFilters:[],
                        rowCount:100,
                        page:1,
                        orderBy:'studyProgramName'
                    })
                        .then((data) => {
                            setSpList(data.result)
                        })
                }
            }}
            onChange={(value) => {
                if(value !== undefined){
                    let existIndex = GridDataOption.namedFilters.findIndex(nf => nf.name === "studyProgramId");
                    if(existIndex !== -1){
                        GridDataOption.namedFilters.splice(existIndex, 1, {name:"studyProgramId", value: value});
                    }else{
                        GridDataOption.namedFilters.push({name:"studyProgramId", value: value});
                    }
                }else{
                    GridDataOption.namedFilters = GridDataOption.namedFilters.filter(nf => nf.name !== "studyProgramId")
                }
                reload()
            }}
            options={spList?.map((studyProgram) => {
                return {
                    label: studyProgram.studyProgramName,
                    value: studyProgram.studyProgramId
                }
            })}/>,
        <SelectImpl 
            placeholder={"Группа"}
            className={"filter"}
            key={"workGroup"}
            onClick={() => {
                if (workgroupList.length === 0){
                    requestToApi.post("/v1/apps/dnk/objects/workgroup/getlist", {
                        namedFilters:[],
                        rowCount:100,
                        page:1,
                        orderBy:'workGroupName'
                    })
                        .then((data) => {
                            setWorkgroupList(data.result)
                        })
                }
            }}
            onChange={(value) => {
                console.log(value)
                if(value !== undefined && value > 0){
                    let existIndex = GridDataOption.namedFilters.findIndex(nf => nf.name === "workGroupId");
                    if(existIndex !== -1){
                        GridDataOption.namedFilters.splice(existIndex, 1, {name:"workGroupId", value: value});
                    }else{
                        GridDataOption.namedFilters.push({name:"workGroupId", value: value});
                    }
                }else{
                    GridDataOption.namedFilters = GridDataOption.namedFilters.filter(nf => nf.name !== "workGroupId")
                }
                reload()
            }}
            options={workgroupList?.map((workGroup) => {
                return {
                    label: workGroup.workGroupName,
                    value: workGroup.workGroupId
                }
            })}/>,
            <RangePicker 
                style = {{"margin-left": "0.5em"}}
                showTime={true}
                onCalendarChange={(value) => {
                    if(value !== undefined && value[0] !== null && value[1] !== null){
                        let existIndex = GridDataOption.namedFilters.findIndex(nf => nf.name === "dateRange");
                        if(existIndex !== -1){
                            GridDataOption.namedFilters.splice(existIndex, 1, {name:"dateRange", value: [value[0].valueOf(), value[1].valueOf()]});
                        }else{
                            GridDataOption.namedFilters.push({name:"dateRange", value: [value[0].valueOf(), value[1].valueOf()]});
                        }
                    }else{
                        GridDataOption.namedFilters = GridDataOption.namedFilters.filter(nf => nf.name !== "dateRange")
                    }
                    reload()
                }}/>,
            <Input 
                className={"filter"}
                placeholder={"Кабинет"}
                onInput={(value) => {
                    value = value.target.value
                    console.log(value)
                    if(value !== undefined){
                        let existIndex = GridDataOption.namedFilters.findIndex(nf => nf.name === "classroom");
                        if(existIndex !== -1){
                            GridDataOption.namedFilters.splice(existIndex, 1, {name:"classroom", value: value});
                        }else{
                            GridDataOption.namedFilters.push({name:"classroom", value: value});
                        }
                    }else{
                        GridDataOption.namedFilters = GridDataOption.namedFilters.filter(nf => nf.name !== "classroom")
                    }
                    reload()
                }}/>
    ]

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
            title: "Преподаватель",
            dataIndex: "teacherName",
            key: "teacherName",
            onCell: record => {
                return {
                    onClick: () => {
                        edit(record.scheduleId)
                    }
                }
            },
            render: (_, entity) => {
                return entity.peopleLastName + " " + entity.peopleName.substring(0, 1) + ". " + entity.peopleMiddleName.substring(0, 1) + "."
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
                return <Button onClick={() => editAttendance(entity.scheduleId, entity.workGroupId)}>Заполнить посещаемость</Button>
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
                    value: key==="scheduleDate"&&data[key]!==null?Dayjs(data[key]):data[key],
                })))
                setShow(true)
            });
    }

    function editAttendance(scheduleId, workGroupId){
        setId(scheduleId)
        peoples = []
        cancel()
        requestToApi.post("/v1/apps/dnk/objects/attendance/getlist", {
            namedFilters: [
                {
                name: "workGroupId",
                value: workGroupId
                },
                {
                    name: "scheduleId",
                    value: scheduleId
                }
            ],
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
        requestToApi.post("/v1/apps/dnk/objects/attendance/save", {
            scheduleId: id,
            attendances: peopleList.map(people => {
                return{
                    peopleId: people.peopleId,
                    attendancePresenceFlag: people.attendancePresenceFlag
                }
            })
        })
            .then(data => {
                setShowAttendance(false)
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
                filters={filters}
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
                    key={id}
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
                    key={id}
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
                        <SelectImpl
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
                        <SelectImpl
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
                        label="Кабинет"
                        rules={[
                            {
                                required: true,
                                message: "Кабинет не может быть пустой"
                            }
                        ]}>
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