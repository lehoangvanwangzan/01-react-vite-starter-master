import { deleteUserAPI, getUsersAPI } from '@/services/api.service';
import { dateRangeValidate } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { DetailUser } from 'components/admin/user/detail.user';

// const HandleDeleteUser = async (id: string) => {
//     
//     const res = await deleteUserAPI(id);
//     if (res.data) {
//         notification.success({
//             message: "Delete User Success",
//             description: "Xóa user thành công",
//         }

//         );
//     } else {
//         notification.error({
//             message: "Delete User Fail",
//             description: JSON.stringify(res.message),
//         });
//     }

// }


type TSearch = {
    fullName?: string;
    email?: string;
    phone?: number;
    createdAt?: string;
    createdAtRange?: string;
}
const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

    const columns: ProColumns<IUserTable>[] = [
        {
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
            render: (dom, entity, index, action, schema) => {
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
            render(dom, entity, index, action, schema) {
                return (<>
                    <EditTwoTone
                        twoToneColor='#f57800'
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                    />
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn chắc chắn xóa user này?"
                        onConfirm={() => {
                            console.log("check delete user", entity._id);
                            // HandleDeleteUser(entity._id)
                        }}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <DeleteTwoTone
                            twoToneColor='#ff4d4f'
                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                        />
                    </Popconfirm >
                </>
                )
            },
        },
    ];
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
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`; // sort tăng dần hoặc giảm dần
                    }

                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data?.meta);
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
                // columnsState={{
                //     persistenceKey: 'pro-table-singe-demos',
                //     persistenceType: 'localStorage',
                //     defaultValue: {
                //         option: { fixed: 'right', disable: true },
                //     },
                //     onChange(value) {
                //         console.log('value: ', value);
                //     },
                // }}
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
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
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
        </>
    );
};

export default TableUser;