import { GetCategoryAPI, UpdateBookAPI, UploadFileAPI } from "@/services/api.service";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Divider, Input, Modal, Form, InputNumber, UploadProps, GetProp, UploadFile, Row, Col, Select, Upload, Image } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
type UserUploadType = "thumbnail" | "slider";
interface IProps {
    openUpdateBook: boolean;
    setOpenUpdateBook: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdateBook: (v: IBookTable | null) => void;
    dataUpdateBook: IBookTable | null;
}
type FieldType = {
    _id: string,
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
export const UpdateBook = (Props: IProps) => {
    const { openUpdateBook, setOpenUpdateBook, refreshTable, dataUpdateBook, setDataUpdateBook } = Props;
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [idSubmit, setIsSubmit] = useState<boolean>(false);
    const [listCategory, setListCategory] = useState<{
        label: string,
        value: string,
    }[]>([]);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
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
    useEffect(() => {
        if (dataUpdateBook) {
            //set fileListThumbnail
            const arrThumbnail = [{
                uid: uuidv4(),
                name: dataUpdateBook.thumbnail,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdateBook.thumbnail}`,
            }]
            const arrSlider = dataUpdateBook?.slider?.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                }
            })
            form.setFieldsValue({
                _id: dataUpdateBook._id,
                mainText: dataUpdateBook.mainText,
                author: dataUpdateBook.author,
                price: dataUpdateBook.price,
                category: dataUpdateBook.category,
                quantity: dataUpdateBook.quantity,
                thumbnail: arrThumbnail,
                Slider: arrSlider,
            })
            setFileListThumbnail(arrThumbnail as any);
            setFileListSlider(arrSlider as any);
        }

    }, [dataUpdateBook])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, mainText, author, price, quantity, category } = values;
        const thumbnail = fileListThumbnail?.[0]?.name ?? "";
        const slider = fileListSlider?.map(item => item.name) ?? [];
        //call API
        setIsSubmit(true);
        const res = await UpdateBookAPI(_id, mainText, author, price, quantity, category, thumbnail, slider);
        if (res && res.data) {
            message.success("Cập nhật book thành công");
            form.resetFields();
            setFileListThumbnail([]);
            setFileListSlider([]);
            setOpenUpdateBook(false);
            setDataUpdateBook(null);
            refreshTable();
        } else {
            notification.error({
                message: "Lỗi cập nhật book",
                description: JSON.stringify(res.message),
            });
        }
        setIsSubmit(false);
    }
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;

    }
    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status == 'uploading') {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return
        }
        if (info.file.status === 'done') {
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
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
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await UploadFileAPI(file, "book")
        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`,
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }]);
            } else if (type === "slider") {
                setFileListSlider((prevState) => [...prevState, uploadedFile, { ...uploadedFile }]);
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
    return (
        <Modal
            title="Tạo mới Book"
            open={openUpdateBook}
            onOk={() => { form.submit() }}
            onCancel={() => {
                // console.log("close modal create book");
                form.resetFields();
                setFileListThumbnail([]);
                setFileListSlider([]);
                setDataUpdateBook(null);
                setOpenUpdateBook(false);

            }}
            destroyOnClose={true}
            okButtonProps={{ loading: idSubmit }}
            okText="Cập nhật"
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

                    <Form.Item<FieldType>
                        hidden={true}
                        labelCol={{ span: 24 }}
                        label="ID"
                        name="_id"
                        rules={[{
                            required: true,
                            message: 'ID không được để trống!'
                        }]}
                    >
                        <Input disabled={true} />
                    </Form.Item>

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
                            labelCol={{ span: 12 }}
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
                            labelCol={{ span: 12 }}
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
                                maxCount={1}
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
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal >
    )
}