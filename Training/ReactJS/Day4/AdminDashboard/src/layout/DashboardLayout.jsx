import {Layout, Menu, Button} from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
const {Header, Sider, Content} = Layout;
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, setCollapsed } from '../features/layout/layoutSlice';
import { toggleTheme } from '../features/theme/themeSlice';

function DashboardLayout({children}) {
    const navigate = useNavigate();
    const location = useLocation(); // to get the current path for menu selection
    const dispatch = useDispatch();

    const collapsed = useSelector((state) => state.layout.collapsed);
    const themeMode = useSelector((state) => state.theme.mode);

    return (
        <Layout>
            <Sider
                collapsible
                collapsed={collapsed}
                theme={themeMode}
                onCollapse={(collapsed) => dispatch(setCollapsed(collapsed))}
                
                >
                    <div
                        style={{
                            height: 64,
                            margin: 16,
                            color: 'white',
                            fontSize: 18,
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                        }}
                        >
                        {collapsed ? '🚀' : 'My Admin'}
                        </div>
                <Menu
                    theme={themeMode}
                    mode="inline"
                    selectedKeys={[location.pathname]} // highlight the current menu item
                    onClick={({key}) => navigate(key)}
                    items={[
                    {
                    key: '/',
                    icon: <DashboardOutlined />,
                    label: 'Dashboard',
                    },
                    {
                    key: '/users',
                    icon: <UserOutlined />,
                    label: 'Users',
                    },
                    {
                    key: '/settings',
                    icon: <SettingOutlined />,
                    label: 'Settings',
                    },
                ]}
                      
                />  
            </Sider>

            <Layout>
                <Header
                    style={{
                        padding: '0 16px',
                        background: themeMode === 'dark' ? '#001529' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => dispatch(toggleSidebar())}
                    />

                    <Button
                        type="text"
                        icon={<BulbOutlined />}
                        onClick={() => dispatch(toggleTheme())}
                    />
                </Header>

                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );

}

export default DashboardLayout;