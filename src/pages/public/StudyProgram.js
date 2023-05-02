import {Table} from 'antd';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../../components/Request';
import PageHeader from "../../components/PageHeader";

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

export default function StudyProgramPublic(){
    const [studyProgramList, setStudyProgramList] = useState([])
    const [loading, setLoading] = useState(true)
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
            setLoading(true);
        }
    })

    useEffect(() => {
        requestToApi.post("/security/v1/apps/dnk/document/studyprogram/getlist", GridDataOption)
            .then(data => {
                setStudyProgramList(data.result)
                pagination.total = data.allRowCount;
                pagination.current = data.page;
                pagination.pageSize = data.rowCount;
            })
            .finally(() => setLoading(false));
    }, [loading])

    let buttons = [
    ]

    return(
        <div>
            <PageHeader
                title={"Программы обучения"}
                buttons={buttons}
            />
            <Table
                dataSource={studyProgramList}
                columns={columns}
                loading={loading}
                pagination={pagination}
                rowKey={(record) => record.studyProgramId}/>
        </div>
    )
}