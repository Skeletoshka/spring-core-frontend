import React, {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {requestToApi} from "../components/Request";
import PageHeader from "../components/PageHeader";
import {Button, DatePicker, Form, Input, Modal, Select, Table} from "antd";

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
        render: (_, entity) => entity.parentLastName + " " + entity.parentName + " " + entity.parentMiddleName
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
        title: "Муниципальное образование",
        dataIndex: "studentMun",
        key: "studentMun",
        width: 250,
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
        title: "Номер телефона учащегося",
        dataIndex: "peoplePhone",
        key: "peoplePhone",
        width: 200,
    },
    {
        title: "Фамилия, Имя, Отчество родителя",
        dataIndex: "parentId",
        key: "parentId",
        width: 300,
        render: (_, entity) => entity.parentLastName + " " + entity.parentName + " " + entity.parentMiddleName
    },
    {
        title: "Номер телефона родителя",
        dataIndex: "parentPhone",
        key: "parentPhone",
        width: 200,
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