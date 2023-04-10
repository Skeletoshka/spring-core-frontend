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

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'controlObjectUrl',
    from:'controlobject'
}

const GridDataOptionRole = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'accessRoleId',
    from:'accessRole'
}

export default function ControlObject(){
    const [controlObjectList, setControlObjectList] = useState()
    const [accessRoleId, setAccessRoleId] = useState()
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [accessRoleList, setAccessRoleList] = useState([])

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    
    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    useEffect(() => {
        if(controlObjectList===undefined){
            requestToApi.post("/v1/apps/refbooks/controlobject/getlist", GridDataOption)
            .then(data => setControlObjectList(data));
        }
        if(accessRoleList.length===0){
            requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOptionRole)
            .then(data => setAccessRoleList(data));
        }
    })

    function reload(){
        requestToApi.post("/v1/apps/refbooks/controlobject/getlist", GridDataOption)
            .then(data => setControlObjectList(data));
        requestToApi.post("/v1/apps/refbooks/accessrole/getlist", GridDataOptionRole)
            .then(data => setAccessRoleList(data));
    }

    function update(){
        requestToApi.post("/v1/apps/refbooks/controlobjectrole/update", {accessRoleId: accessRoleId, 
            controlObjects:selectedRowKeys.map((rowKey) => {return {controlObjectId: rowKey}})})
            setTimeout(() => {
                reload() 
            }, 50);
    }

    let buttons = [
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={update}>Обновить права</Button>
    ]
    
    return(
        <div>
            <PageHeader
                title={"Ресурсы"}
                buttons={buttons}
            />
            <div>
                <Select 
                onChange={(value) => { 
                    GridDataOption.namedFilters.push({name:"accessRoleId", value: value});
                    setAccessRoleId(value);
                    reload();
                }}
                options={accessRoleList.map((accessrole) => {
                    return {
                        label: accessrole.accessRoleName,
                        value: accessrole.accessRoleId
                    }
                })}/> 
            </div>
            <Table 
                dataSource={controlObjectList} 
                columns={columns}
                rowSelection={rowSelection}
                rowKey={(record) => record.controlObjectId}/>
        </div>
    )
}