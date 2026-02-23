import { Card, Col, Row, Statistic, Progress, List, Avatar } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: 11280,
      prefix: <UserOutlined />,
      suffix: "users",
      change: 12.5,
      changeType: "positive",
      type: "default"
    },
    {
      title: "Total Orders",
      value: 8562,
      prefix: <ShoppingCartOutlined />,
      suffix: "orders",
      change: 8.2,
      changeType: "positive",
      type: "success"
    },
    {
      title: "Revenue",
      value: 125430,
      prefix: <DollarOutlined />,
      suffix: "$",
      precision: 2,
      change: 15.3,
      changeType: "positive",
      type: "warning"
    },
    {
      title: "Page Views",
      value: 45678,
      prefix: <EyeOutlined />,
      suffix: "views",
      change: -3.2,
      changeType: "negative",
      type: "error"
    },
  ];

  const recentActivities = [
    {
      title: "New user registered",
      time: "2 minutes ago",
      icon: <UserOutlined />,
    },
    {
      title: "Order #12345 completed",
      time: "15 minutes ago",
      icon: <ShoppingCartOutlined />,
    },
    {
      title: "Payment received $450",
      time: "1 hour ago",
      icon: <DollarOutlined />,
    },
    {
      title: "New subscriber joined",
      time: "2 hours ago",
      icon: <UserOutlined />,
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your projects today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.type}`}>
            <div className="stat-header">
              <div>
                <div className="stat-value">
                  {stat.prefix}
                  {stat.value.toLocaleString()}
                  {stat.suffix && <span>{stat.suffix}</span>}
                </div>
                <div className="stat-label">{stat.title}</div>
                <div className={`stat-change ${stat.changeType}`}>
                  {stat.changeType === "positive" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="stat-icon">{stat.prefix}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <Card className="chart-card" title="Sales Overview">
          <div style={{ padding: "20px 0" }}>
            <Progress
              percent={75}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
            <div style={{ marginTop: 20 }}>
              <Progress
                percent={60}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                status="active"
              />
            </div>
          </div>
        </Card>

        <Card className="chart-card" title="Performance Metrics">
          <div style={{ padding: "20px 0" }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="Efficiency" value={93} suffix="%" />
              </Col>
              <Col span={12}>
                <Statistic title="Quality" value={87} suffix="%" />
              </Col>
            </Row>
          </div>
        </Card>
      </div>

      <Card className="activity-section" title="Recent Activity">
        <List
          className="activity-list"
          itemLayout="horizontal"
          dataSource={recentActivities}
          renderItem={(item) => (
            <List.Item className="activity-item">
              <List.Item.Meta
                avatar={<Avatar icon={item.icon} className="activity-icon" />}
                title={<div className="activity-title">{item.title}</div>}
                description={<div className="activity-time">{item.time}</div>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Dashboard;