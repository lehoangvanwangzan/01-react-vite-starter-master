import { Input, Button, Form, Divider, App } from "antd";
import type { FormProps } from 'antd';
import { NavLink, useNavigate } from "react-router-dom";
import './login.scss'
import { useState } from "react";
import { loginAPI } from "@/services/api.service";
import { useCurrentApp } from "@/components/context/app.context";
type FieldType = {
    username: string,
    password: string,
}

const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { message, notification } = App.useApp();
    const [idSubmit, setIsSubmit] = useState(false);
    const { setIsAuthenticated, setUser } = useCurrentApp(); //lấy context từ app.context.tsx
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        //call API
        setIsSubmit(true);
        const { username, password } = values;
        const res = await loginAPI(username, password);

        if (res?.data) { //nếu có dữ liệu trả về
            setIsAuthenticated(true); //set authenticated = true
            setUser(res.data.user); //set user = user từ response
            localStorage.setItem("access_token", res.data.access_token); //lưu token vào localStorage
            message.success("Đăng nhập user thành công");;
            navigate("/") //sau khi nhập thành công chuyển qua trang home
        } else {
            notification.error({
                message: "Login User Fail",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            });
        }
        setIsSubmit(false);
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
                            <h2 className="text text-large"> Đăng nhập</h2>
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
                                    label="Email"
                                    name="username"
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
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={idSubmit}>
                                        Login
                                    </Button>
                                </Form.Item>
                                <Divider> hoặc</Divider>
                                <p className="text text-normal" style={{ textAlign: "center" }}>
                                    Chưa có tài khoản? <NavLink to="/register">Đăng ký tại đây</NavLink>
                                </p>
                            </Form>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
export default LoginPage;