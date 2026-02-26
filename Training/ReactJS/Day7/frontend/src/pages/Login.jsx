import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Alert, Space, Divider } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { login, selectIsAuthenticated } from "../features/auth/authSlice";

const { Title, Text, Paragraph } = Typography;

const Login = () => {
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values) => {
    setError("");

    try {
      await dispatch(login({ email: values.email, password: values.password })).unwrap();
      navigate("/dashboard");
    } catch (err) {
      setError(err || "Login failed");
    }
  };

  const demoCredentials = [
    { email: "admin@mail.com", role: "Admin" },
    { email: "hr@mail.com", role: "HR" },
    { email: "supervisor@mail.com", role: "Supervisor" },
    { email: "manager@mail.com", role: "Manager" },
  ];

  const handleDemoLogin = (email) => {
    form.setFieldsValue({ email, password: "password123" });
  };

  return (
    <div style={styles.container}>
      <Card style={styles.loginCard}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              RBAC System
            </Title>
            <Text type="secondary">Employee Management Portal</Text>
          </div>

          <Divider />

          {error && (
            <Alert
              message="Login Failed"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError("")}
            />
          )}

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                block
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <Divider>Quick Login</Divider>

          <div>
            <Paragraph style={{ marginBottom: 12, fontWeight: 500 }}>
              Demo Accounts (Password: password123)
            </Paragraph>
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              {demoCredentials.map((cred) => (
                <Button
                  key={cred.email}
                  block
                  onClick={() => handleDemoLogin(cred.email)}
                  style={{ textAlign: "left" }}
                >
                  <Space>
                    <UserOutlined />
                    <span>{cred.role}</span>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {cred.email}
                    </Text>
                  </Space>
                </Button>
              ))}
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  loginCard: {
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
};

export default Login;
