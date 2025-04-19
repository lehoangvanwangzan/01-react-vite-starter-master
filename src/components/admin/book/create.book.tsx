import { CreateBookAPI, GetCategoryAPI, UploadFileAPI } from "@/services/api.service";
import { App, Divider, Input, Modal, Form, InputNumber, Row, Col, Select, Upload, Image } from "antd";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { UploadChangeParam } from "antd/es/upload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import type { GetProp, UploadFile, UploadProps } from "antd";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type UserUploadType = "thumbnail" | "slider";
interface IProps {
    openCreateBook: boolean;
    setOpenCreateBook: (v: boolean) => void;
    refreshTable: () => void;
}
type FieldType = {
    author: string,
    title: string,
    price: number,
    quantity: number,
    category: string,
    publisher: string,
    thumbnail: any,
    mainText: any,
    slider: string,

}
export const CreateBook = (Props: IProps) => {
    const { openCreateBook, setOpenCreateBook, refreshTable } = Props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [idSubmit, setIsSubmit] = useState<boolean>(false);
    const [listCategory, setListCategory] = useState<{
        label: string,
        value: string,
    }[]>([]); //component select
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { mainText, author, price, quantity, category } = values;
        const thumbnail = fileListThumbnail?.[0]?.name ?? "";
        const slider = fileListSlider?.map((item) => item.name) ?? [];
        console.log("check onFinish", thumbnail, slider);
        setIsSubmit(true);
        const res = await CreateBookAPI(mainText, author, price, quantity, category, thumbnail, slider);
        if (res && res.data) {
            message.success("Tạo mới sách thành công");
            form.resetFields();
            setFileListThumbnail([]);
            setFileListSlider([]);
            setOpenCreateBook(false);
            refreshTable();
        } else {
            notification.error({
                message: "Create Book Fail",
                description: res.message,
            });
        }
        setIsSubmit(false);
    }

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await GetCategoryAPI();
            if (res && res.data) {
                const parsedData = Array.isArray(res.data) ? res.data : JSON.parse(res.data);
                const data = parsedData.map((item: any) => ({
                    label: item,
                    value: item,
                }));
                setListCategory(data);
            }
        };
        fetchCategory();
    }, []);

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ có thể upload file JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error('File upload nhỏ hơn 2MB !');
        }

        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };
    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === "thumbnail") {
            setFileListThumbnail([]);
        }
        if (type === "slider") {
            const newSlider = fileListSlider.filter((item) => item.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    }
    const handlePreview = async (file: UploadFile) => {
        console.log("check file preview", file);
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status == 'uploading') {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return
        }
        if (info.file.status === 'done') {
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await UploadFileAPI(file, "book")
        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded, // fileUploaded file api
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`,
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }]);
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }]);
            }
            if (onSuccess) {
                onSuccess('ok');
            }
        } else {
            notification.error({
                message: "Upload file Fail",
                description: JSON.stringify(res.message),
            });
        }
    }
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;

    }


    return (
        <Modal
            title="Tạo mới Book"
            open={openCreateBook}
            onOk={() => { form.submit() }}
            onCancel={() => {
                // console.log("close modal create book");
                form.resetFields();
                setFileListThumbnail([]);
                setFileListSlider([]);
                setOpenCreateBook(false);

            }}
            destroyOnClose={true}
            okButtonProps={{ loading: idSubmit }}
            okText="Tạo mới"
            cancelText="Hủy"
            confirmLoading={idSubmit}
            width={"50vw"}
            maskClosable={false}
        >
            <Divider />
            <Form
                form={form}
                layout="vertical"
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={15}>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Tên sách"
                            name="mainText"
                            rules={[{
                                required: true,
                                message: 'Tên sách không được để trống!'
                            }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            label="Tác giả"
                            name="author"
                            rules={[
                                { required: true, message: 'Tác giả không được bỏ trống!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={15}>
                    <Col span={6}>
                        <Form.Item<FieldType>
                            label="Thể loại"
                            name="category"
                            rules={[
                                { required: true, message: 'Thể loại không được bỏ trống!' },
                            ]}
                        >
                            <Select
                                showSearch
                                allowClear
                                options={listCategory}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item<FieldType>
                            label="Giá tiền"
                            name="price"
                            rules={[
                                { required: true, message: 'Giá không được bỏ trống!' },
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                formatter={(values) => `${values}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter=" đ"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item<FieldType>
                            label="Số lượng"
                            name="quantity"
                            rules={[
                                { required: true, message: 'Số lượng không được bỏ trống!' },
                            ]}
                        >
                            <InputNumber type="number" min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={15}>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Ảnh Thumbnail"
                            name="thumbnail"
                            rules={[
                                { required: true, message: 'Vui lòng nhập upload thumbnail!' },
                            ]}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload

                                listType="picture-card"
                                className="avatar-uploader"
                                maxCount={1}
                                multiple={false}
                                customRequest={(options) => handleUploadFile(options, "thumbnail")}
                                beforeUpload={beforeUpload}
                                onChange={(info) => handleChange(info, 'thumbnail')}
                                onPreview={handlePreview}
                                onRemove={(file) => handleRemove(file, "thumbnail")}
                                fileList={fileListThumbnail}
                            >
                                <div>
                                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}> Upload</div>
                                </div>

                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Ảnh Slider"
                            name="slider"
                            rules={[
                                { required: true, message: 'Vui lòng nhập upload slider!' },
                            ]}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                maxCount={3}
                                multiple={false}

                                customRequest={(options) => handleUploadFile(options, "slider")}
                                beforeUpload={beforeUpload}
                                onChange={(info) => handleChange(info, 'slider')}
                                onPreview={handlePreview}
                                onRemove={(file) => handleRemove(file, "slider")}
                                fileList={fileListSlider}
                            >
                                <div>
                                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}> Upload</div>
                                </div>

                            </Upload>

                        </Form.Item>
                    </Col>
                </Row>
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
            </Form>
        </Modal >

    )
}