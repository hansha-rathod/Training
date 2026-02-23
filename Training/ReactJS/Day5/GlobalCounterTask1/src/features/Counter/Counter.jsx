import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, reset, toggleLock } from './counterSlice.js'
import { Button, Switch, Badge, Layout } from 'antd'
import { LockOutlined, UnlockOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons'


function Counter() {
    const count = useSelector((state) => state.counter.count)
    const isLocked = useSelector((state) => state.counter.isLocked)
    const dispatch = useDispatch()

    return(
        <Layout style={{ padding: '50px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <Badge count={count} showZero>
                <div style={{ padding: '20px', background: '#f0f0f0' }}>Counter</div>
            </Badge>

            <Switch
                checked={isLocked}
                onChange={() => dispatch(toggleLock())}
                checkedChildren={<LockOutlined />}
                unCheckedChildren={<UnlockOutlined />}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                    icon={<PlusOutlined />}
                    onClick={() => dispatch(increment())}
                    disabled={isLocked}
                >
                    Increment
                </Button>

                <Button
                    icon={<MinusOutlined />}
                    onClick={() => dispatch(decrement())}
                    disabled={isLocked}
                >
                    Decrement
                </Button>

                <Button
                    onClick={() => dispatch(reset())}
                    disabled={isLocked}
                >
                    Reset
                </Button>
            </div>
        </Layout>
    )
}

export default Counter