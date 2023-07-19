import React, {useEffect, useState} from "react";
import {requestToApi} from "../components/Request";
import PageHeader from "../components/PageHeader";
import {Button, DatePicker, Table} from "antd";
import SelectImpl from '../components/SelectImpl';
import {CheckOutlined} from '@ant-design/icons'

const columns = [
    {
        title: "Наименование программы",
        dataIndex: "studyProgramName",
        key: "studyProgramName",
        width: 200,
        fixed: 'left'
    },
    {
        title: "№ группы",
        dataIndex: "workGroupName",
        key: "workGroupName",
        width: 108,
    },
    {
        title: "Фамилия, Имя, Отчество обучающегося",
        dataIndex: "people",
        key: "peopleId",
        width: 300,
        render: (_, entity) => entity.peopleLastName + " " + entity.peopleName.substring(0, 1) + ". " + entity.peopleMiddleName.substring(0, 1) + "."
    },
    {
        title: "Фамилия, Имя, Отчество родителя",
        dataIndex: "parentId",
        key: "parentId",
        width: 300,
        render: (_, entity) => entity.teacherLastName + " " + entity.teacherName.substring(0, 1) + ". " + entity.teacherMiddleName.substring(0, 1) + "."
    },
    {
        title:'Наличие',
        dataIndex:'attendancePresenceFlag',
        key:'attendancePresenceFlag',
        render: (attendancePresenceFlag) => {
            if (attendancePresenceFlag===1){
                return <span><CheckOutlined/></span>
            }
        }
    },
    {
        title: "Дата проведения",
        dataIndex: "scheduleDate",
        key: "scheduleDate",
        render: (peopleDateBirth) => {
            return new Date(peopleDateBirth).toLocaleString()
        }
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'rowId',
}

export default function AttendanceReport(){
    const [reportList, setReportList] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [spList, setSpList] = useState([])
    const [teacherList, setTeacherList] = useState([])
    const [studentList, setStudentList] = useState([])
    const [workgroupList, setWorkgroupList] = useState([])
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
                        namedFilters:[
                            {
                                name: "capClassId",
                                value: 1
                            }
                        ],
                        rowCount:100,
                        page:1,
                        orderBy:'peopleLastName'
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
            placeholder={"Студент"}
            className={"filter"}
            key={"teacher"}
            onClick={() => {
                if (studentList.length === 0){
                    requestToApi.post("/v1/apps/dnk/objects/people/getlist", {
                        namedFilters:[
                            {
                                name: "capClassId",
                                value: 4
                            }
                        ],
                        rowCount:100,
                        page:1,
                        orderBy:'peopleLastName'
                    })
                        .then((data) => {
                            setStudentList(data.result)
                        })
                }
            }}
            onChange={(value) => {
                if(value !== undefined){
                    let existIndex = GridDataOption.namedFilters.findIndex(nf => nf.name === "studentId");
                    if(existIndex !== -1){
                        GridDataOption.namedFilters.splice(existIndex, 1, {name:"studentId", value: value});
                    }else{
                        GridDataOption.namedFilters.push({name:"studentId", value: value});
                    }
                }else{
                    GridDataOption.namedFilters = GridDataOption.namedFilters.filter(nf => nf.name !== "studentId")
                }
                reload()
            }}
            options={studentList?.map((student) => {
                return {
                    label: student.peopleLastName + " " + student.peopleName.substring(0, 1) + ". " + student.peopleMiddleName.substring(0, 1) + ". ",
                    value: student.peopleId
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
            }}/>
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
            requestToApi.post("/v1/apps/dnk/objects/report/attendance/getlist", GridDataOption)
                .then(data => {
                    setReportList(data.result)
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

    let buttons = [
        <Button onClick={reload}>Обновить</Button>,
    ]

    return (
        <div>
            <PageHeader
                title={"Отчёт посещаемости"}
                buttons={buttons}
                filters = {filters}
            />
            <Table
                dataSource={reportList}
                columns={columns}
                style={{maxWidth:"100%"}}
                scroll={{x: true}}
                loading={loading}
                rowKey={(record) => record.rowId}
                pagination={pagination}/>
        </div>
    )
}