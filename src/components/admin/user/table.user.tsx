import { dateRangeValidate } from '@/services/helper';
import { deleteUserAPI, getUsersAPI } from '@/services/api.service';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { DetailUser, } from 'components/admin/user/detail.user';
import { CreateUser } from 'components/admin/user/create.user';
import { ImportUser } from 'components/admin/user/import.user';
import { CSVLink } from "react-csv";
import { UpdateUser } from 'components/admin/user/update.user';
import dayjs from 'dayjs';
type TSearch = {
    fullName?: string;
    email?: string;
    phone?: number;
    createdAt?: string;
    createdAtRange?: string;
}
const TableUser = () => {
    const { message, notification } = App.useApp();
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
    const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);

    const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
    const [dataUpdateUser, setDataUpdateUser] = useState<IUserTable | null>(null);

    const [openImportUser, setOpenImportUser] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    const columns: ProColumns<IUserTable>[] = [
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
                        onClick={() => {
                            setOpenViewDetail(true);
                            setDataViewDetail(entity);
                        }}
                        href='#'>{entity._id}</a>
                )
            },

        },
        {
            title: 'Email ',
            dataIndex: 'email',
            copyable: true,
            ellipsis: true,
            tooltip: 'Email người dùng',
        },
        {
            title: 'Họ và tên ',
            dataIndex: 'fullName',
            copyable: true,
            ellipsis: true,
            tooltip: 'Email người dùng',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            copyable: true,
            ellipsis: true,
            tooltip: 'số điện thoại người dùng',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            tooltip: 'ngày tạo user',
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
                            setOpenUpdateUser(true);
                            setDataUpdateUser(entity);
                        }}
                    />
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn chắc chắn xóa user này?"
                        onConfirm={() => {
                            console.log("check delete user", entity._id);
                            HandleDeleteUser(entity._id)
                        }}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        placement="left"
                        okButtonProps={{ loading: isDeleteUser }}
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
    const HandleDeleteUser = async (_id: string) => {
        setIsDeleteUser(true);
        const res = await deleteUserAPI(_id);
        if (res.data) {
            message.success('Xóa user thành công');
            refreshTable();
        } else {
            notification.error({
                message: "Xóa user thất bại",
                description: res.message,
            });
        }
        setIsDeleteUser(false);
    }
    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log("check param", params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`;
                        }
                        if (params.email) {
                            query += `&email=/${params.email}/i`;
                        }
                        if (params.phone) {
                            query += `&phone=/${params.phone}/i`;
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

                    const res = await getUsersAPI(query);
                    if (res.data) {
                        console.log("check res data", res.data?.result ?? []);
                        setMeta(res.data?.meta);
                        setCurrentDataTable(res.data?.result ?? []);
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
                headerTitle="Table user"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename='export-user.csv'
                    >
                        <Button
                            key="button"
                            icon={<ExportOutlined />}
                            type='primary'
                        >
                            Export
                        </Button>

                    </CSVLink>
                    ,
                    <Button
                        key="button"
                        icon={<CloudUploadOutlined />}
                        onClick={() => {
                            setOpenImportUser(true);
                        }}
                        type="primary"
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenCreateUser(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>



                ]}
            />
            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateUser
                openCreateUser={openCreateUser}
                setOpenCreateUser={setOpenCreateUser}
                refreshTable={refreshTable}
            />
            <ImportUser
                openImportUser={openImportUser}
                setOpenImportUser={setOpenImportUser}
                refreshTable={refreshTable}
            />
            <UpdateUser
                openUpdateUser={openUpdateUser}
                setOpenUpdateUser={setOpenUpdateUser}
                setDataUpdateUser={setDataUpdateUser}
                dataUpdateUser={dataUpdateUser}
                refreshTable={refreshTable}
            />

        </>
    );
};

export default TableUser;