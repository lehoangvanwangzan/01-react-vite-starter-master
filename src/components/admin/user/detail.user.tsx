import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUserTable | null;
    setDataViewDetail: (v: IUserTable | null) => void;

}
export const DetailUser = (Props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = Props;
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    return (
        <>
            <Drawer
                title="Thông tin chi tiết người dùng"
                placement="right"
                onClose={onClose}
                open={openViewDetail}
                width={"50vw"}
            >
                <Descriptions
                    title="Thông tin người dùng"
                    bordered
                    column={2}

                >
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Họ và tên">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{dataViewDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Vai trò">
                        {/* <Badge status={dataViewDetail?.role === "ADMIN" ? "success" : "default"} text={dataViewDetail?.role} /> */}
                        <Badge status="processing" text={dataViewDetail?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái" span={2}>
                        <Badge status={dataViewDetail?.isActive ? "success" : "error"} text={dataViewDetail?.isActive ? "Đang hoạt động" : "Ngừng hoạt động"} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo" >
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>

            </Drawer >
        </>
    )
}
