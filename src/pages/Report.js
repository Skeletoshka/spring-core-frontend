import React, {useEffect, useState} from "react";
import {requestToApi} from "../components/Request";
import PageHeader from "../components/PageHeader";
import {Button, Table} from "antd";
import SelectImpl from '../components/SelectImpl';

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
        title: "№ П/П",
        dataIndex: "rowId",
        key: "rowId",
        width: 85,
    },
    {
        title: "Фамилия, Имя, Отчество обучающегося",
        dataIndex: "people",
        key: "peopleId",
        width: 300,
        render: (_, entity) => entity.peopleLastName + " " + entity.peopleName + " " + entity.peopleMiddleName
    },
    {
        title: "Дата рождения",
        dataIndex: "peopleDateBirth",
        key: "peopleDateBirth",
        width: 110,
        render: (peopleDateBirth) => {
            return new Date(peopleDateBirth).toLocaleDateString()
        }
    },
    {
        title: "Дата зачисления",
        dataIndex: "peopleDateStart",
        key: "peopleDateStart",
        width: 120,
        render: (peopleDateStart) => {
            return new Date(peopleDateStart).toLocaleDateString()
        },
    },
    {
        title: "Образовательная организация",
        dataIndex: "companyName",
        key: "companyName",
        width: 260,
    },
    {
        title: "Класс",
        dataIndex: "studentClass",
        key: "studentClass",
        width: 120,
    },
    {
        title: "Номер договора",
        dataIndex: "documentRealNumber",
        key: "documentRealNumber",
        width: 200,
    },
    {
        title: "Дата договора",
        dataIndex: "contractDate",
        key: "contractDate",
        width: 120,
        render: (contractDate) => {
            return new Date(contractDate).toLocaleDateString()
        }
    },
    {
        title: "Фамилия, Имя, Отчество родителя",
        dataIndex: "parentId",
        key: "parentId",
        width: 300,
        render: (_, entity) => entity.parentLastName + " " + entity.parentName + " " + entity.parentMiddleName
    },
    {
        title: "Электронная почта родителя",
        dataIndex: "parentEmail",
        key: "parentEmail",
        width: 250,
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'rowId',
}

export default function Report(){
    const [reportList, setReportList] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [spList, setSpList] = useState([])
    const [companyList, setCompanyList] = useState([])
    const [workgroupList, setWorkgroupList] = useState([])
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
            placeholder={"Образовательная организация"}
            className={"filter"}
            key={"company"}
            onClick={() => {
                if (companyList.length === 0){
                    requestToApi.post("/v1/apps/contragent/company/getlist", {
                        namedFilters:[],
                        rowCount:100,
                        page:1,
                        orderBy:'companyName'
                    })
                        .then((data) => {
                            setCompanyList(data.result)
                        })
                }
            }}
            onChange={(value) => {
                if(value !== undefined){
                    let existIndex = GridDataOption.namedFilters.findIndex(nf => nf.name === "companyId");
                    if(existIndex !== -1){
                        GridDataOption.namedFilters.splice(existIndex, 1, {name:"companyId", value: value});
                    }else{
                        GridDataOption.namedFilters.push({name:"companyId", value: value});
                    }
                }else{
                    GridDataOption.namedFilters = GridDataOption.namedFilters.filter(nf => nf.name !== "companyId")
                }
                reload()
            }}
            options={companyList?.map((company) => {
                return {
                    label: company.companyName,
                    value: company.companyId
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
            })}/>
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
            requestToApi.post("/v1/apps/dnk/objects/report/getlist", GridDataOption)
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
                title={"Отчёт"}
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