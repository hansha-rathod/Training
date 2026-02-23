import Counter from './features/counter/Counter';
import { Layout } from 'antd';
import './App.css'

const { Content } = Layout;

function App() {


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Counter />
      </Content>
    </Layout>
  );
}

export default App
