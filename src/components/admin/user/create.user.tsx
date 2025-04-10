import { App, Divider, Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import { useState } from "react";
import { createUserAPI } from "@/services/api.service";

interface IProps {
    openCreateUser: boolean;
    setOpenCreateUser: (v: boolean) => void;
    refreshTable: () => void;

}
type FieldType = {
    fullName: string,
    email: string,
    password: string,
    phone: number
}
export const CreateUser = (Props: IProps) => {
    const { openCreateUser, setOpenCreateUser, refreshTable } = Props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [idSubmit, setIsSubmit] = useState<boolean>(false);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, email, password, phone } = values;
        //call API
        console.log("values create", values);
        setIsSubmit(true);
        const res = await createUserAPI(fullName, email, password, phone);
        if (res && res.data) {
            message.success("Tạo mới user thành công");
            form.resetFields();
            setOpenCreateUser(false);
            refreshTable();
        } else {
            notification.error({
                message: "Create User Fail",
                description: JSON.stringify(res.message),
            });
        }
        setIsSubmit(false);
    }
    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openCreateUser}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenCreateUser(false)
                    form.resetFields();
                }}
                okText="Tạo mới"
                cancelText="Hủy bỏ"
                confirmLoading={idSubmit}
            >
                <Divider />
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Họ tên"
                        name="fullName"
                        rules={[{
                            required: true,
                            message: 'Họ tên không được để trống!'
                        }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Email không được bỏ trống!' },
                            { type: "email", message: 'Email không đúng định dạng!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        rules={[{
                            required: true,
                            message: 'Mật khẩu không được để trống!'
                        }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="phone"
                        rules={[{
                            required: true,
                            pattern: new RegExp(/\d+/g),
                            message: 'Số điện thoại sai định dạng!'
                        }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}