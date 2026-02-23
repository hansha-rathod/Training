import { useSelector, useDispatch } from 'react-redux'
import { Table } from 'antd'
import { Button, Space, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { removeItem } from './InventorySlice.js'


function Inventory() {
    const inventory = useSelector((state) => state.inventory.items)
    const dispatch = useDispatch()

    return(
        <Table dataSource={inventory} rowKey="id" columns={[
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price'
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Space size="middle">

                        <Popconfirm
                            title="Are you sure to delete this item?"
                            onConfirm={() => dispatch(removeItem(record.id))}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger icon={<DeleteOutlined />}>
                                Delete
                            </Button>
                        </Popconfirm>

                    </Space>
                )
            }
        ]} />
    )

}

export default Inventory
