import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { CreateBook } from 'components/admin/book/create.book';
import { ImportBook } from 'components/admin/book/import.book';
import { CSVLink } from "react-csv";
import dayjs from 'dayjs';
import { DetailBook } from './detail.book';
import { UpdateBook } from './update.book';
import { deleteBookAPI, getBooksAPI } from '@/services/api.service';
type TSearch = {
    thumbnail: string;
    mainText: string;
    category: string;
    author: string;
    price: string;
    createdAtRange: string;
    createdAt: string;
}
const TableBook = () => {
    const { message, notification } = App.useApp();
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);
    const [openCreateBook, setOpenCreateBook] = useState<boolean>(false);

    const [openUpdateBook, setOpenUpdateBook] = useState<boolean>(false);
    const [dataUpdateBook, setDataUpdateBook] = useState<IBookTable | null>(null);

    const [openImportBook, setOpenImportBook] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);
    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
    const columns: ProColumns<IBookTable>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '_id',
            dataIndex: '_id',
            copyable: true,
            ellipsis: true,
            tooltip: 'id là bắt buộc',
            hideInSearch: true,
            render: (dom, entity) => {
                return (
                    <a
                        href='#' onClick={() => {
                            setOpenViewDetail(true);
                            setDataViewDetail(entity);
                        }}
                    >{entity._id}</a>
                )
            },

        },
        {
            title: 'Tên sách ',
            dataIndex: 'mainText',
            copyable: true,
            ellipsis: true,
            tooltip: 'Tên sách là bắt buộc',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            copyable: true,
            ellipsis: true,
            tooltip: 'Thể loại sách',
            sorter: true,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            copyable: true,
            ellipsis: true,
            tooltip: 'Tác giả viết sách',
            sorter: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            copyable: true,
            ellipsis: true,
            tooltip: 'Giá tiền sách (Quyển)',
            sorter: true,
            render: (dom, entity) => {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN',
                            { style: 'currency', currency: 'VND' }).format(entity.price)}
                    </>
                )
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            tooltip: 'ngày tạo sách',
            valueType: 'date',
            hideInSearch: true,
            sorter: true,
            render: (dom, entity) => {
                return (
                    <>
                        {dayjs(entity.createdAt).format("DD-MM-YYYY")}
                    </>
                )
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
        },
        {
            title: 'Action',
            tooltip: 'Edit, Delete',
            hideInSearch: true,
            render(dom, entity) {
                return (<>
                    <EditTwoTone
                        twoToneColor='#f57800'
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                        onClick={() => {
                            setOpenUpdateBook(true);
                            setDataUpdateBook(entity);
                        }}
                    />
                    <Popconfirm
                        title="Xóa sách"
                        description="Bạn chắc chắn xóa sachs này?"
                        onConfirm={() => {
                            console.log("check delete book", entity._id);
                            HandleDeleteBook(entity._id)
                        }}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        placement="left"
                        okButtonProps={{ loading: isDeleteBook }}
                    >
                        <DeleteTwoTone
                            twoToneColor='#ff4d4f'
                            style={{ cursor: 'pointer', marginLeft: '20px' }}
                        />
                    </Popconfirm >
                </>
                )
            },
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }
    //delete user
    const HandleDeleteBook = async (_id: string) => {
        setIsDeleteBook(true);
        const res = await deleteBookAPI(_id);
        if (res.data) {
            message.success('Xóa book thành công');
            refreshTable();
        } else {
            notification.error({
                message: "Xóa book thất bại",
                description: res.message,
            });
        }
        setIsDeleteBook(false);
    }
    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log("check param", params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`;
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`;
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        console.log("check createDateRange ", params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                        }
                    }
                    //default sort
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`; // sort tăng dần hoặc giảm dần
                    } else query += `&sort=-createdAt`;
                    if (sort && sort.price) {
                        query += `&sort=${sort.price === 'ascend' ? 'price' : '-price'}`; // sort tăng dần hoặc giảm dần
                    } else query += `&sort=-price`;
                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === 'ascend' ? 'mainText' : '-mainText'}`; // sort tăng dần hoặc giảm dần
                    } else query += `&sort=-mainText`;
                    if (sort && sort.author) {
                        query += `&sort=${sort.author === 'ascend' ? 'author' : '-author'}`; // sort tăng dần hoặc giảm dần
                    } else query += `&sort=-author`;
                    if (sort && sort.category) {
                        query += `&sort=${sort.category === 'ascend' ? 'category' : '-category'}`; // sort tăng dần hoặc giảm dần
                    } else query += `&sort=-category`;


                    const res = await getBooksAPI(query);
                    if (res.data) {
                        console.log("check res data", res.data?.result ?? []);
                        setMeta(res.data?.meta);
                        // setCurrentDataTable(res.data?.result ?? []);
                    }
                    return {
                        // data: data.data,
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total,
                    }
                }}
                editable={{
                    type: 'multiple',
                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (<div>{range[0]}-{range[1]} trên {total} rows</div>)
                    },
                }}
                dateFormatter="string"
                headerTitle="Table book"
                toolBarRender={() => [

                    <Button
                        key="button"
                        icon={<ExportOutlined />}
                        type='primary'
                    >
                        <CSVLink
                            data={currentDataTable}
                            filename='export-book.csv'
                        >
                            Export
                        </CSVLink>
                    </Button>
                    ,
                    <Button
                        key="button"
                        icon={<CloudUploadOutlined />}
                        onClick={() => {
                            setOpenImportBook(true);
                        }}
                        type="primary"
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenCreateBook(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>



                ]}
            />
            <DetailBook
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateBook
                openCreateBook={openCreateBook}
                setOpenCreateBook={setOpenCreateBook}
                refreshTable={refreshTable}
            />
            <ImportBook
                openImportBook={openImportBook}
                setOpenImportBook={setOpenImportBook}
                refreshTable={refreshTable}
            />
            <UpdateBook
                openUpdateBook={openUpdateBook}
                setOpenUpdateBook={setOpenUpdateBook}
                setDataUpdateBook={setDataUpdateBook}
                dataUpdateBook={dataUpdateBook}
                refreshTable={refreshTable}
            />

        </>
    );
};

export default TableBook;