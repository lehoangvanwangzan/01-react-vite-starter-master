
import { App, Divider, Modal, Form } from "antd"
import { useState } from "react";

interface IProps {
    openExportUser: boolean;
    setOpenExportUser: (v: boolean) => void;
}
export const ExportUser = (props: IProps) => {
    const { openExportUser, setOpenExportUser } = props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [idSubmit, setIsSubmit] = useState<boolean>(false);
    return (
        <>
            <Modal
                title="Export data User"
                open={openExportUser}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenExportUser(false)
                }}
                okText="Xác nhận"
                cancelText="Hủy bỏ"
                confirmLoading={idSubmit}
            >
                <Divider />

            </Modal>
        </>
    )
}