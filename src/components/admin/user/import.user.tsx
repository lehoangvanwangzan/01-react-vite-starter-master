import { InboxOutlined } from "@ant-design/icons";
import { Divider, Modal, Upload, Table, message } from "antd"
import { useState } from "react";
import type { UploadProps } from "antd";
const { Dragger } = Upload;
interface IProps {
    openImportUser: boolean;
    setOpenImportUser: (v: boolean) => void;
}
export const ImportUser = (props: IProps) => {
    const { openImportUser, setOpenImportUser } = props;
    const [idSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok")
            }, 1000)
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            <Modal
                title="Import data User"
                width={"50vw"}
                open={openImportUser}
                onOk={() => { setOpenImportUser(false) }}
                onCancel={() => {
                    setOpenImportUser(false)
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: true
                }}
                maskClosable={false}
            >
                <Divider />
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        title={() => <h4>Dữ liệu upload:</h4>}
                        columns={[
                            { dataIndex: "fullName", title: "Tên hiển thị" },
                            { dataIndex: "email", title: "Email" },
                            { dataIndex: "phone", title: "Số điện thoại" },
                        ]}
                    >

                    </Table>
                </div>
            </Modal>
        </>
    )
}