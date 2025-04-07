import { App, Divider, Input, Modal, Form } from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { UpdateUserAPI } from "@/services/api.service";

interface IProps {
    openUpdateUser: boolean;
    setOpenUpdateUser: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdateUser: (v: IUserTable | null) => void;
    dataUpdateUser: IUserTable | null;
}
type FieldType = {
    _id: string,
    fullName: string,
    email: string,
    phone: string
}
export const UpdateUser = (Props: IProps) => {
    const { openUpdateUser, setOpenUpdateUser, refreshTable, dataUpdateUser, setDataUpdateUser } = Props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [idSubmit, setIsSubmit] = useState<boolean>(false);
    useEffect(() => {
        if (dataUpdateUser) {
            form.setFieldsValue({
                _id: dataUpdateUser._id,
                fullName: dataUpdateUser.fullName,
                email: dataUpdateUser.email,
                phone: dataUpdateUser.phone,
            })
        }

    }, [dataUpdateUser])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, fullName, phone } = values;
        //call API
        setIsSubmit(true);
        const res = await UpdateUserAPI(_id, fullName, phone);
        if (res && res.data) {
            message.success("Cập nhật user thành công");
            form.resetFields();
            setOpenUpdateUser(false);
            setDataUpdateUser(null);
            refreshTable();
        } else {
            notification.error({
                message: "Update User Fail",
                description: JSON.stringify(res.message),
            });
        }
        setIsSubmit(false);
    }
    return (
        <>
            <Modal
                title="Cập nhật User "
                open={openUpdateUser}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenUpdateUser(false)
                    setDataUpdateUser(null);
                    form.resetFields();
                }}
                okText="Cập nhật"
                cancelText="Hủy"
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
                        hidden={true}
                        label="_id"
                        name="_id"
                        rules={[{
                            required: true,
                            message: 'ID không được để trống!'
                        }]}
                    >
                        <Input disabled />
                    </Form.Item>
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
                        <Input disabled />
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