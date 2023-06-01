import {Button, Modal, Table, Form, Input, Upload, Select} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState, useEffect } from 'react';
import {requestToApi} from '../components/Request';
import PageHeader from "../components/PageHeader";
import {DownloadOutlined, PlusOutlined} from "@ant-design/icons";
import fileSaver from "file-saver/dist/FileSaver";

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'appendixId'
}

export default function Appendix() {
    const [appendixList, setAppendixList] = useState([])
    const [documentTypeList, setDocumentTypeList] = useState([])
    const [loading, setLoading] = useState(true)
    const [id, setId] = useState(undefined)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [show, setShow] = useState(false)
    const [form] = useForm()
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
            title: "Наименование",
            dataIndex: "appendixName",
            key: "appendixName",
            onCell: record => {
                return {
                    onClick: () => {
                        edit(record.appendixId)
                    }
                }
            }
        },
        {
            title: "Тип документа",
            dataIndex: "documentTypeName",
            key: "documentTypeName",
            onCell: record => {
                return {
                    onClick: () => {
                        edit(record.appendixId)
                    }
                }
            }
        },
        {
            title: "Владелец",
            dataIndex: "progUserName",
            key: "progUserName",
            onCell: record => {
                return {
                    onClick: () => {
                        edit(record.appendixId)
                    }
                }
            }
        },
        {
            title: "Дата создания",
            dataIndex: "documentRealDateCreate",
            key: "documentRealDateCreate",
            render: (data) => new Date(data).toLocaleDateString(),
            onCell: record => {
                return {
                    onClick: () => {
                        edit(record.appendixId)
                    }
                }
            }
        },
        {
            title: "Дата модификации",
            dataIndex: "documentRealDateModify",
            key: "documentRealDateModify",
            render: (data) => new Date(data).toLocaleDateString(),
            onCell: record => {
                return {
                    onClick: () => {
                        edit(record.appendixId)
                    }
                }
            }
        },
        {
            title: "",
            dataIndex: "download",
            key: "download",
            render: (_, entity) => <a href={process.env.PUBLIC_URL +
                ("" + entity.appendixPath).replace(/.+public/, "")}
                                      download={entity.appendixName}>Скачать</a>
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
            requestToApi.post("/v1/apps/dnk/objects/appendix/getlist", GridDataOption)
                .then(data => {
                    setAppendixList(data.result);
                    pagination.total = data.allRowCount;
                    pagination.current = data.page;
                    pagination.pageSize = data.rowCount;
                })
                .finally(() => setLoading(false));
        }
    }, [loading])

    function reload(){
        setLoading(true);
    }

    function cancel(){
        setShow(false);
    }

    function edit(id){
        requestToApi.post("/v1/apps/dnk/objects/appendix/get", id)
            .then(data => {
                setId(data.appendixId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: data[key],
                })));
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            values.appendixId = id;
            requestToApi.post("/v1/apps/dnk/objects/appendix/save", values)
                .then(data => {
                    reload()
                    setShow(false)
                })
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/dnk/objects/appendix/delete", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    function onFileChangeHandler(e){
        e.preventDefault();
        let formData;
        formData = new FormData();
        formData.append('multipartFile', e.target.files[0]);
        console.log(formData)
        requestToApi.postFile('/v1/apps/dnk/objects/appendix/upload?type=' + form.getFieldValue('documentTypeId'), formData)
            .then(() => reload());
    }

    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={() => edit(null)}>Добавить</Button>
    ]

    return (
        <div>
            <PageHeader
                title={"Файлы"}
                buttons={buttons}
            />
            <Modal open={show}
                   title="Изменение файла"
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
                    style={{padding: 20}}>
                    <Form.Item
                        name="documentTypeId"
                        label="Тип документа">
                        <Select
                            style={{ width: '100%' }}
                            onClick={() => {
                                if(documentTypeList.length === 0) {
                                    requestToApi.post("/v1/apps/refbooks/documenttype/getlist", {
                                        namedFilters:[],
                                        rowCount:100,
                                        page:1,
                                        orderBy:'documentTypeId'
                                    })
                                        .then(data => setDocumentTypeList(data.result));
                                }
                            }}
                            options={documentTypeList.map((documentType) => {
                                return {
                                    label: documentType.documentTypeName,
                                    value: documentType.documentTypeId
                                }
                            })}
                        />
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                        label="Загрузка файла">
                            <Input type={"file"} icon={<PlusOutlined/>} onChange={onFileChangeHandler}></Input>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={appendixList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                rowKey={(record) => record.appendixId}
                pagination={pagination}/>
        </div>
    )

}