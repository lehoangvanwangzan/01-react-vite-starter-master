import { CreateBookAPI, GetCategoryAPI } from "@/services/api.service";
import { App, Divider, Input, Modal, Form, InputNumber, UploadProps, GetProp, UploadFile, Row, Col, message, Select } from "antd";
import { FormProps, Upload } from "antd/lib";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { UploadChangeParam } from "antd/es/upload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type UserUploadType = "thumbnail" | "slider";
interface IProps {
    openCreateBook: boolean;
    setOpenCreateBook: (v: boolean) => void;
    refreshTable: () => void;
    setDataCreateBook: (v: IBookTable | null) => void;
    dataCreateBook: IBookTable | null;
}
type FieldType = {
    _id: string,
    author: string,
    title: string,
    description: string,
    price: number,
    quantity: number,
    category: string,
    publisher: string,
    thumbnail: any,
    mainText: any,
    slider: string,

}
export const CreateBook = (Props: IProps) => {
    const { openCreateBook, setOpenCreateBook, refreshTable, dataCreateBook, setDataCreateBook } = Props;
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

    const [previewOpent, setPreviewOpent] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await GetCategoryAPI();
            if (res && res.data) {
                const data = res.data.map((item) => {
                    return {
                        label: item,
                        value: item,
                    }
                })
                setListCategory(data);
            } else {
                notification.error({
                    message: "Get category Fail",
                    description: JSON.stringify(res.message),
                });
            }
        }
        fetchCategory();
    }, [])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        console.log(values);
        setIsSubmit(false);
    }
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

        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status == 'uploading') {
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return
        }
        if (info.file.status === 'done') {
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    }
    const handleUploadFile: UploadProps['customRequest'] = ({ file, onSuccess }) => {
        setTimeout(() => {
            if (onSuccess)
                onSuccess("ok");
        }, 1000);
    }
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }
    // useEffect(() => {
    //     if (dataCreateBook) {
    //         //set fileListThumbnail
    //         const arrThumbnail = [{
    //             uid: uuidv4(),
    //             name: dataCreateBook.thumbnail,
    //             status: "done",
    //             url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataCreateBook.thumbnail}`,
    //         }]
    //         const arrSlider = dataCreateBook?.slider?.map(item => {
    //             return {
    //                 uid: uuidv4(),
    //                 name: item,
    //                 status: "done",
    //                 url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
    //             }
    //         })
    //         form.setFieldsValue({
    //             _id: dataCreateBook._id,
    //             mainText: dataCreateBook.mainText,
    //             author: dataCreateBook.author,
    //             price: dataCreateBook.price,
    //             category: dataCreateBook.category,
    //             quantity: dataCreateBook.quantity,
    //             thumbnail: dataCreateBook.thumbnail,
    //             Slider: dataCreateBook.slider,
    //             description: dataCreateBook.description,
    //         })
    //         setFileListThumbnail(arrThumbnail as UploadFile[]);
    //         setFileListSlider(arrSlider as UploadFile[]);
    //     }

    // }, [dataCreateBook])
    // const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    //     const { _id, mainText, author, price, quantity, category, description } = values;
    //     const thumbnail = fileListThumbnail?.[0]?.name ?? "";
    //     const slider = fileListSlider?.map((file) => file.name) ?? [];
    //     //call API
    //     setIsSubmit(true);
    //     const res = await CreateBookAPI(_id, mainText, author, price, quantity, category, thumbnail, slider, description);
    //     if (res && res.data) {
    //         message.success("Tạo mới book thành công");
    //         form.resetFields();
    //         setFileListThumbnail([]);
    //         setFileListSlider([]);
    //         setOpenCreateBook(false);
    //         setDataCreateBook(null);
    //         refreshTable();
    //     } else {
    //         notification.error({
    //             message: "Lỗi tạo mới book",
    //             description: JSON.stringify(res.message),
    //         });
    //     }
    //     setIsSubmit(false);
    // }
    return (
        <>
            <Modal
                title="Tạo mới Book"
                open={openCreateBook}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setFileListThumbnail([]);
                    setFileListSlider([]);
                    setDataCreateBook(null);
                    setOpenCreateBook(false)
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
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
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
                                <Input type="number" min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Col span={24}>
                        <Form.Item<FieldType>
                            label="Mô tả"
                            name="description"

                        >
                            <Input />
                        </Form.Item>
                    </Col>
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
                                    customRequest={handleUploadFile}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                // onPreview={handlePreview}
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
                                    customRequest={handleUploadFile}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                // onPreview={handlePreview}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}> Upload</div>
                                    </div>

                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal >
        </>
    )
}