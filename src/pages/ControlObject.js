import { Button, Table, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import {CheckOutlined} from '@ant-design/icons'
import PageHeader from "../components/PageHeader";

const columns = [
    {
        title:'Наименование ресурса',
        dataIndex:'controlObjectName',
        key:'controlObjectName'
    },
    {
        title:'Доступ',
        dataIndex:'accessFlag',
        key:'accessFlag',
        render: (accessFlag) => {
            if (accessFlag===1){
                return <span><CheckOutlined/></span>
            }
        }
    },
    {
        title:'url ресурса',
        dataIndex:'controlObjectUrl',
        key:'controlObjectUrl'
    }
]

const GridDataOptionRole = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'accessRoleId'
}

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'controlObjectUrl'
}

export default function ControlObject(){
    const [controlObjectList, setControlObjectList] = useState()
    const [accessRoleId, setAccessRoleId] = useState()
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [accessRoleList, setAccessRoleList] = useState([]);
    const [loading, setLoading] = useState(true);
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
        requestToApi.post("/v1/apps/refbooks/controlobject/getlist", GridDataOption)
            .then(data => {
                setControlObjectList(data.result);
                pagination.total = data.allRowCount;
                pagination.current = data.page;
                pagination.pageSize = data.rowCount;
            })
            .finally(() => setLoading(false));
    }, [loading])

    function reload(){
        setLoading(true)
    }

    function bind(){
        requestToApi.post("/v1/apps/refbooks/controlobjectrole/bind", {accessRoleId: accessRoleId,
            controlObjects:selectedRowKeys.map((rowKey) => {return {controlObjectId: rowKey}})})
            .finally(reload);
    }

    function unbind(){
        requestToApi.post("/v1/apps/refbooks/controlobjectrole/unbind", {accessRoleId: accessRoleId,
            controlObjects:selectedRowKeys.map((rowKey) => {return {controlObjectId: rowKey}})})
            .finally(reload);
    }

    let buttons = [
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={bind}>Дать права</Button>,
        <Button onClick={unbind}>Забрать права</Button>
    ]
    
    return(
        <div>
            <PageHeader
                title={"Ресурсы"}
                buttons={buttons}
            />
            <div>
                <Select
                    style={{width: "15%"}}
                    onClick={() => {
                        if (accessRoleList.length === 0){
                            requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOptionRole)
                                .then((data) => {
                                    setAccessRoleList(data.result)
                                })
                        }
                    }}
                    onChange={(value) => {
                        GridDataOption.namedFilters.push({name:"accessRoleId", value: value});
                        setAccessRoleId(value);
                        reload();
                    }}
                    options={accessRoleList?.map((accessrole) => {
                        return {
                            label: accessrole.accessRoleName,
                            value: accessrole.accessRoleId
                        }
                    })}/>
            </div>
            <Table 
                dataSource={controlObjectList}
                loading={loading}
                columns={columns}
                rowSelection={rowSelection}
                rowKey={(record) => record.controlObjectId}
                pagination={pagination}
            />
        </div>
    )
}