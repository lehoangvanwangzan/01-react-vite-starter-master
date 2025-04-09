import { FORMATE_DATE_VN } from "@/services/helper";
import { Descriptions, Divider, Drawer, Image, Upload, UploadFile, UploadProps } from "antd";
import { GetProp } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IBookTable | null;
    setDataViewDetail: (v: IBookTable | null) => void;

}
export const DetailBook = (Props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = Props;

    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    useEffect(() => {
        if (dataViewDetail) {
            let imgThubnail: any = {}, imgSlider: UploadFile[] = [];
            if (dataViewDetail.thumbnail) {
                imgThubnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_URL_BACKEND}/images/book/${dataViewDetail?.thumbnail}`,
                }
            }
            if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: dataViewDetail.thumbnail,
                        status: 'done',
                        url: `${import.meta.env.VITE_URL_BACKEND}/images/book/${item}`,
                    })
                })
            }
            setFileList([imgThubnail, ...imgSlider])
        }
    }, [dataViewDetail])

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    return (
        <>
            <Drawer
                title="Thông tin chi tiết sách"
                placement="right"
                onClose={onClose}
                open={openViewDetail}
                width={"50vw"}
            >
                <Descriptions
                    title="Thông tin sách"
                    bordered
                    column={2}

                >
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sách">{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label=" Giá tiền">{
                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewDetail?.price ?? 0)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thể loại" span={2}>{dataViewDetail?.category}</Descriptions.Item>
                    {/* <Descriptions.Item label="Trạng thái" >
                        <Badge status={dataViewDetail?.isActive ? "success" : "error"} text={dataViewDetail?.isActive ? "Đang hoạt động" : "Ngừng hoạt động"} />
                    </Descriptions.Item> */}
                    <Descriptions.Item label="Ngày tạo" >
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả" span={2} >
                        {dataViewDetail?.description}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left"> Ảnh Book</Divider>
                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                ></Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage('')
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer >
        </>
    )
}
