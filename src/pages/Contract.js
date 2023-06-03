import React, {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {requestToApi} from "../components/Request";
import {Button, DatePicker, Form, Input, Modal, Select, Table} from "antd";
import PageHeader from "../components/PageHeader";
import Dayjs from "dayjs";

const columns = [
    {
        title: 'Имя документа',
        dataIndex: 'documentRealName',
        key: 'documentRealName'
    },
    {
        title: 'Дата договора',
        dataIndex: 'contractDate',
        key: 'contractDate',
        render: (value) => new Date(value).toLocaleDateString()
    },
    {
        title:'Тип договора',
        dataIndex: 'documentTypeName',
        key: 'documentTypeName'
    },
    {
        title: "",
        dataIndex: "download",
        key: "download",
        render: (_, entity) => <a href={process.env.PUBLIC_URL +
            ("" + entity.appendixPath).replace(/.+files/, "")}
                                  download={entity.appendixName}>Скачать</a>
    }
]

const GridDataOption = {
    namedFilters:[],
    rowCount:10,
    page:1,
    orderBy:'contractId'
}

export default function Contract(){

    const [contractList, setContractList] = useState([]);
    const [documentTypeList, setDocumentTypeList] = useState([]);
    const [file, setFile] = useState(new FormData());
    const [id, setId] = useState();
    const [show, setShow] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange:onSelectChange
    };

    function cancel(){
        setShow(false)
    }

    useEffect(() => {
        if(loading) {
            requestToApi.post("/v1/apps/document/contract/getlist", GridDataOption)
                .then(data => {
                    setContractList(data.result)
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

    function edit(id){
        requestToApi.post("/v1/apps/document/contract/get", id)
            .then(data => {
                setId(data.contractId)
                form.setFields(Object.keys(data).map((key) => ({
                    name: key,
                    value: key==="contractDate"?Dayjs(data[key]):data[key]
                })))
                setShow(true)
            });
    }

    function submit(){
        form.validateFields().then((values) => {
            let formData = new FormData();
            formData.append("multipartFile", file)
            values.contractDate = new Date(values.contractDate).getTime()
            requestToApi.postFile('/v1/apps/document/appendix/upload', formData)
                .then(data => {
                    values.appendixPath = data.url
                    values.contractId = id;
                    requestToApi.post("/v1/apps/document/contract/save", values)
                        .then(data => {
                            reload()
                            setShow(false)
                        })
                });
        })
    }

    function deleteRows(){
        requestToApi.post("/v1/apps/document/contract/delete", selectedRowKeys)
            .then(data => {
                reload()
            })
    }

    function onFileChangeHandler(e){
        e.preventDefault();
        setFile(e.target.files[0]);
    }

    let buttons = [
        <Button onClick={deleteRows}>Удалить</Button>,
        <Button onClick={reload}>Обновить</Button>,
        <Button onClick={() => edit(null)}>Добавить</Button>
    ]

    return(
        <div>
            <PageHeader
                title={"Договор"}
                buttons={buttons}
            />
            <Modal open = {show}
                   title="Изменение Договора"
                   onCancel={cancel}
                   footer={[
                       <Button onClick={submit}>
                           Сохранить
                       </Button>,
                       <Button onClick={cancel}>
                           Назад
                       </Button>
                   ]}>
                <Form
                    form={form}
                    layout={"vertical"}
                    centered={true}
                    name="formRegistry"
                    style={{padding: 20}}>
                    <Form.Item
                        name="documentRealNumber"
                        label="Номер договора"
                        rules={[
                            {
                                required: true,
                                message: "Номер договора не может быть пустым"
                            }
                        ]}>
                        <Input name="documentRealNumber"
                               placeholder="Номер договора"/>
                    </Form.Item>
                    <Form.Item
                        name="contractDate"
                        label="Дата договора"
                        rules={[
                            {
                                required: true,
                                message: "Дата договора не может быть пустым"
                            }
                        ]}>
                        <DatePicker name="contractDate"/>
                    </Form.Item>
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
                        name="appendixName"
                        label="Имя файла договора"
                        rules={[
                            {
                                required: true,
                                message: "Имя файла договора не может быть пустым"
                            }
                        ]}>
                        <Input name="appendixName"
                               placeholder="Имя файла договора"/>
                    </Form.Item>
                    <Form.Item
                        name="appendixFile"
                        label="Файл договора"
                        rules={[
                            {
                                required: true,
                                message: "Файл договора не может быть пустым"
                            }
                        ]}>
                        <Input name="appendixFile"
                               placeholder="Файл договора"
                               type={"file"}
                               onChange={onFileChangeHandler}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                dataSource={contractList}
                columns={columns}
                loading={loading}
                rowSelection={rowSelection}
                pagination={pagination}
                rowKey={(record) => record.contractId}/>
        </div>
    )
}