import { Button, Typography, InputNumber, Space, Card, List, Text, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, setValue, reset } from './counterSlice';
import { useEffect } from 'react';

const { Title } = Typography;

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const history = useSelector((state) => state.counter.history);
  const dispatch = useDispatch();

  // Bonus: Show notification when count is a multiple of 10
  useEffect(() => {
    if (count > 0 && count % 10 === 0) {
      message.success(`🎉 Congratulations! You reached ${count}!`);
    }
  }, [count]);

  return (
    <Card style={{ width: 400 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>

        <Title level={2}>Global Counter</Title>

        <Title>{count}</Title>

        {/* Buttons */}
        <Space>
          <Button
            type="primary"
            onClick={() => dispatch(increment())}
          >
            Increment
          </Button>

          <Button
            danger
            onClick={() => dispatch(decrement())}
            disabled={count === 0}
          >
            Decrement
          </Button>

          <Button
            onClick={() => dispatch(reset())}
          >
            Reset
          </Button>
        </Space>

        {/* Set Value */}
        <InputNumber
          style={{ width: '100%' }}
          placeholder="Enter value"
          min={0}
          onChange={(val) => dispatch(setValue(val || 0))}
        />

        {/* History */}
        <div>
          <Title level={4}>History</Title>

          {history.length === 0 ? (
            <Text type="secondary">No history yet. Start counting!</Text>
          ) : (
            <List
              size="small"
              bordered
              dataSource={history}
              renderItem={(item, index) => (
                <List.Item>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text>Step {index + 1}</Text>
                    <Text strong>{item}</Text>
                  </Space>
                </List.Item>
              )}
              style={{ maxHeight: 150, overflowY: 'auto' }}
            />
          )}
        </div>

      </Space>
    </Card>
  );
}

export default Counter;