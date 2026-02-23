import {
  Card,
  Form,
  Input,
  Switch,
  Button,
  Select,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  SkinOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const Settings = () => {
  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();

  const handleProfileSave = (values) => {
    console.log("Profile settings:", values);
    message.success("Profile updated successfully!");
  };

  const handleSecuritySave = (values) => {
    console.log("Security settings:", values);
    message.success("Security settings updated!");
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="settings-section">
        <div className="settings-section-title">
          <UserOutlined />
          <h2>Profile Settings</h2>
        </div>
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileSave}
          className="settings-form"
          initialValues={{
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            username: "johndoe",
          }}
        >
          <div className="form-item">
            <label>First Name</label>
            <Input
              placeholder="Enter your first name"
              size="large"
            />
          </div>
          <div className="form-item">
            <label>Last Name</label>
            <Input
              placeholder="Enter your last name"
              size="large"
            />
          </div>
          <div className="form-item">
            <label>Email Address</label>
            <Input
              type="email"
              placeholder="Enter your email"
              size="large"
            />
            <div className="form-item-hint">
              We'll send notifications to this email
            </div>
          </div>
          <div className="form-item">
            <label>Username</label>
            <Input
              placeholder="Choose a username"
              size="large"
            />
          </div>
          <div className="settings-actions">
            <Button size="large">Cancel</Button>
            <Button type="primary" htmlType="submit" size="large">
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>

      {/* Notification Settings */}
      <Card className="settings-section">
        <div className="settings-section-title">
          <BellOutlined />
          <h2>Notification Preferences</h2>
        </div>
        <div className="settings-form">
          <div className="settings-toggle">
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">Email Notifications</div>
              <div className="settings-toggle-description">
                Receive email updates about your account activity
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="settings-toggle">
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">Push Notifications</div>
              <div className="settings-toggle-description">
                Receive push notifications on your devices
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="settings-toggle">
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">SMS Notifications</div>
              <div className="settings-toggle-description">
                Receive SMS alerts for important updates
              </div>
            </div>
            <Switch />
          </div>

          <div className="settings-toggle">
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">Marketing Emails</div>
              <div className="settings-toggle-description">
                Receive emails about new features and offers
              </div>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="settings-section">
        <div className="settings-section-title">
          <LockOutlined />
          <h2>Security</h2>
        </div>
        <Form
          form={securityForm}
          layout="vertical"
          onFinish={handleSecuritySave}
          className="settings-form"
        >
          <div className="form-item">
            <label>Current Password</label>
            <Input.Password
              placeholder="Enter current password"
              size="large"
            />
          </div>
          <div className="form-item">
            <label>New Password</label>
            <Input.Password
              placeholder="Enter new password"
              size="large"
            />
          </div>
          <div className="form-item">
            <label>Confirm New Password</label>
            <Input.Password
              placeholder="Confirm new password"
              size="large"
            />
          </div>

          <div className="settings-toggle" style={{ marginTop: "24px" }}>
            <div className="settings-toggle-info">
              <div className="settings-toggle-label">Two-Factor Authentication</div>
              <div className="settings-toggle-description">
                Add an extra layer of security to your account
              </div>
            </div>
            <Switch />
          </div>

          <div className="settings-actions">
            <Button size="large">Cancel</Button>
            <Button type="primary" htmlType="submit" size="large">
              Update Security
            </Button>
          </div>
        </Form>
      </Card>

      {/* Appearance Settings */}
      <Card className="settings-section">
        <div className="settings-section-title">
          <SkinOutlined />
          <h2>Appearance</h2>
        </div>
        <div className="settings-form">
          <div className="form-item">
            <label>Theme</label>
            <Select
              defaultValue="system"
              size="large"
              style={{ width: "100%" }}
              options={[
                { value: "light", label: "Light Mode" },
                { value: "dark", label: "Dark Mode" },
                { value: "system", label: "System Default" },
              ]}
            />
          </div>
          <div className="form-item">
            <label>Language</label>
            <Select
              defaultValue="en"
              size="large"
              style={{ width: "100%" }}
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
                { value: "zh", label: "Chinese" },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="settings-section danger">
        <div className="settings-section-title">
          <ExclamationCircleOutlined />
          <h2>Danger Zone</h2>
        </div>
        <div className="settings-form">
          <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button danger icon={<ExclamationCircleOutlined />} size="large">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;