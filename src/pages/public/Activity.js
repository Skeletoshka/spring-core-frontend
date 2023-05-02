import React, {useEffect, useState} from "react";
import {requestToApi} from "../../components/Request";
import {Table} from "antd";
import PageHeader from "../../components/PageHeader";

const columns = [
    {
        title: "Наименование события",
        dataIndex: "activityName",
        key: "activityName"
    },
    {
        title: "Дата события",
        dataIndex: "activityDate",
        key: "activityDate",
        render: (activityDate) => {
            return new Date(activityDate).toLocaleDateString()
        }
    },
    {
        title: "Направление",
        dataIndex: "directionName",
        key: "directionName"
    },
    {
        title: "Адрес",
        dataIndex: "address",
        key: "address",
        render: (_, entity) => {
            return "г. " + entity.townName + ", ул. " + entity.streetName + ", д. " + entity.addressHouse
                + (entity.addressLitera!==null?entity.addressLitera:"")
                + (entity.addressCorpus!==null?"к." + entity.addressCorpus:"")
        }
    },
    {
        title: "Партнёр",
        dataIndex: "companyName",
        key: "companyName"
    },
    {
        title: "Тип события",
        dataIndex: "capClassName",
        key: "capClassName"
    },
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'activityName'
}

export default function ActivityPublic(){
    const [activityList, setActivityList] = useState([])
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
        requestToApi.post("/security/v1/apps/dnk/document/activity/getlist", GridDataOption)
            .then(data => {
                setActivityList(data.result)
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
                title={"События"}
                buttons={buttons}
            />
            <Table
                dataSource={activityList}
                columns={columns}
                loading={loading}
                rowKey={(record) => record.activityId}/>
        </div>
    )
}