import { InboxOutlined } from "@ant-design/icons";
import { Divider, Modal, Upload, Table, App, notification } from "antd"
import { useState } from "react";
import type { UploadProps } from "antd";
import Exceljs from "exceljs";
import { Buffer } from "buffer";
import { bulkCreateUserAPI } from "@/services/api.service";
import templateFile from "assets/template/template_import_book.xlsx?url";
const { Dragger } = Upload;
interface IProps {
    openImportBook: boolean;
    setOpenImportBook: (v: boolean) => void;
    refreshTable: () => void;
}
interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}
export const ImportBook = (props: IProps) => {
    const { openImportBook, setOpenImportBook, refreshTable } = props;
    const { message } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [idSubmit, setIsSubmit] = useState<boolean>(false);
    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok")
            }, 1000)
        },

        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log("check info:", info.file, info.fileList);
            }
            if (status === 'done') {
                console.log(info)
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    //load file to buffer
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file?.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer!);
                    await workbook.xlsx.load(buffer);
                    //convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        let keys = firstRow.values as any[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })
                    });
                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    });
                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const handleImport = async () => {
        setIsSubmit(true);
        //call API
        console.log("check dataImport", dataImport)
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD,
        }))
        const res = await bulkCreateUserAPI(dataSubmit);
        if (res.data) {
            notification.success({
                message: "Import data thành công",
                description: `Đã import ${res.data.countSuccess} user thành công, ${res.data.countError} user không thành công`,
            });
        } else {
            notification.error({
                message: "Import data thất bại",
                description: JSON.stringify(res.message),
            });
        }
        setIsSubmit(false);
        setOpenImportBook(false);
        setDataImport([]);
        refreshTable();
    }
    return (
        <>
            <Modal
                title="Import data User"
                width={"50vw"}
                open={openImportBook}
                onOk={() => handleImport()}
                onCancel={() => {
                    setOpenImportBook(false)
                    setDataImport([]);
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: idSubmit,
                }}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Divider />
                <Dragger {...propsUpload} >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xlsx, .xls file.
                        &nbsp;
                        <a
                            onClick={e => e.stopPropagation()}
                            href={templateFile}
                            download="template_import.xlsx"
                        >
                            Download sample file
                        </a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        title={() => <h4>Dữ liệu upload:</h4>}
                        dataSource={dataImport}
                        columns={[
                            { dataIndex: "fullName", title: "Tên hiển thị" },
                            { dataIndex: "email", title: "Email" },
                            { dataIndex: "phone", title: "Số điện thoại" },
                        ]}
                    />
                </div>
            </Modal>
        </>
    )
}