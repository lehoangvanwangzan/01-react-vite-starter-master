import { Input, Button, Form, Divider } from "antd";
import type { FormProps } from 'antd';
import { NavLink } from "react-router-dom";
import './register.scss'
import { useState } from "react";
type FieldType = {
    fullName?: string,
    email?: string,
    password?: string,
    phone?: string
}

const RegisterPage = () => {
    const [form] = Form.useForm();
    const [idSubmit, setIsSubmit] = useState(false);
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    }
    const formItemLayout = {
        labelCol: {
            xl: { span: 24 },
            md: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xl: { span: 24 },
            md: { span: 24 },
            sm: { span: 8 },
        },
    };
    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large"> Đăng ký tài khoản</h2>
                            <Divider />
                            <Form
                                {...formItemLayout}
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
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={idSubmit}>
                                        Register
                                    </Button>
                                </Form.Item>
                                <Divider> Hoặc</Divider>
                                <p className="text text-normal" style={{ textAlign: "center" }}>
                                    Đã có tài khoản? <NavLink to="/login">Đăng nhập tại đây</NavLink>
                                </p>
                            </Form>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
export default RegisterPage;