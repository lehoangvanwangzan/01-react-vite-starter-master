import { Button, Result } from "antd";
import { useCurrentApp } from "components/context/app.context";
import { NavLink, useLocation } from "react-router-dom";

interface IProps {
    children: React.ReactNode;
}
export const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    console.log(location.pathname);
    if (!isAuthenticated) {
        return (
            <Result
                status="404"
                title="Not Login"
                subTitle="Bạn vui lòng đăng nhập để sử dụng tính năng này."
                extra={<Button type="primary"><NavLink to={"/"}>Back Home</NavLink></Button>}
            />
        )
    }
    const isAdminRoute = location.pathname.includes("/admin");
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role; //lấy role từ user trong context
        if (role !== "ADMIN") {//kiểm tra role có phải là admin không
            return (
                <Result
                    status="403"
                    title="Not Administrator"
                    subTitle="Bạn không phải quản trị viên, vui lòng đăng nhập tài khoảng quản trị."
                    extra={<Button type="primary"><NavLink to={"/"}>Back Home</NavLink></Button>}
                />
            )
        }
    }

    return (
        <>
            {props.children}
        </>
    );

};