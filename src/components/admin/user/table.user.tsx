import { getUsersAPI } from '@/services/api.service';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRef } from 'react';

const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const waitTime = async (time: number = 100) => {
    await waitTimePromise(time);
};


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
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: 'id là bắt buộc',
                },
            ],
        },
    },
    {
        title: 'Email',
        dataIndex: 'email',
        copyable: true,
        ellipsis: true,
        tooltip: 'Email người dùng',
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        copyable: true,
        ellipsis: true,
        tooltip: 'số điện thoại người dùng',
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        tooltip: 'ngày tạo user',
    },
    {
        title: 'Action',
        tooltip: 'Edit, Delete',
    },
];

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(sort, filter);
                    const res = await getUsersAPI();
                    console.log(res.data?.result);
                    return {
                        // data: data.data,
                        data: res.data?.result,
                        "page": 1,
                        "success": true,
                        "total": res.data?.meta.total,
                    }

                }}
                editable={{
                    type: 'multiple',
                }}
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                    defaultValue: {
                        option: { fixed: 'right', disable: true },
                    },
                    onChange(value) {
                        console.log('value: ', value);
                    },
                }}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                }}
                options={{
                    setting: {
                        listsHeight: 400,
                    },
                }}
                form={{

                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                pagination={{
                    pageSize: 5,
                    onChange: (page) => console.log(page),
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
        </>
    );
};

export default TableUser;