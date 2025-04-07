import { App, Divider, Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import { useState } from "react";
// import { CreateBookAPI } from "@/services/api.service";

interface IProps {
    openCreateBook: boolean;
    setOpenCreateBook: (v: boolean) => void;
    refreshTable: () => void;

}
type FieldType = {
    fullName: string,
    email: string,
    password: string,
    phone: number
}
export const CreateBook = (Props: IProps) => {
    const { openCreateBook, setOpenCreateBook, refreshTable } = Props;
    const [form] = Form.useForm();
    // const { message, notification } = App.useApp();
    const [idSubmit, setIsSubmit] = useState<boolean>(false);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        // const { fullName, email, password, phone } = values;
        //call API
        setIsSubmit(true);
        // const res = await CreateBookAPI(fullName, email, password, phone);
        // if (res && res.data) {
        //     message.success("Tạo mới user thành công");
        //     form.resetFields();
        //     setOpenCreateBook(false);
        //     refreshTable();
        // } else {
        //     notification.error({
        //         message: "Create User Fail",
        //         description: JSON.stringify(res.message),
        //     });
        // }
        // setIsSubmit(false);
    }
    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openCreateBook}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenCreateBook(false)
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