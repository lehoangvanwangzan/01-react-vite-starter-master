import { UpdateBookAPI } from "@/services/api.service";
import { App, Divider, Input, Modal, Form, InputNumber, UploadProps, GetProp, UploadFile, Row, Col } from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
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
    description: string,
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
    // useEffect(() => {
    //     const fetchCategory = async () => {
    //         const res = await GetCategoryAPI();
    //         if (res && res.data) {
    //             const data = res.data.map((item) => {
    //                 return {
    //                     label: item,
    //                     value: item,
    //                 }
    //             })
    //             setListCategory(data);
    //         } else {
    //             notification.error({
    //                 message: "Get category Fail",
    //                 description: JSON.stringify(res.message),
    //             });
    //         }
    //     }

    // }, [])
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
                thumbnail: dataUpdateBook.thumbnail,
                Slider: dataUpdateBook.slider,
                description: dataUpdateBook.description,
            })
            setFileListThumbnail(arrThumbnail as UploadFile[]);
            setFileListSlider(arrSlider as UploadFile[]);
        }

    }, [dataUpdateBook])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, mainText, author, price, quantity, category, description } = values;
        const thumbnail = fileListThumbnail?.[0]?.name ?? "";
        const slider = fileListSlider?.map((file) => file.name) ?? [];
        //call API
        setIsSubmit(true);
        const res = await UpdateBookAPI(_id, mainText, author, price, quantity, category, thumbnail, slider, description);
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
    return (
        <>
            <Modal
                title="Cập nhật Book"
                open={openUpdateBook}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setFileListThumbnail([]);
                    setFileListSlider([]);
                    setDataUpdateBook(null);
                    setOpenUpdateBook(false)
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
                        <Col span={8}>
                            <Form.Item<FieldType>
                                label="Thể loại"
                                name="category"
                                rules={[
                                    { required: true, message: 'Thể loại không được bỏ trống!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                label="Giá"
                                name="price"
                                rules={[
                                    { required: true, message: 'Giá không được bỏ trống!' },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    type="number" min={0} step={1}
                                    addonAfter="VND"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    { required: true, message: 'Số lượng không được bỏ trống!' },
                                ]}
                            >
                                <Input type="number" min={0} step={1} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item<FieldType>
                        label="Mô tả"
                        name="description"

                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Hình ảnh"
                        name="thumbnail"
                        rules={[
                            { required: true, message: 'Hình ảnh không được bỏ trống!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}