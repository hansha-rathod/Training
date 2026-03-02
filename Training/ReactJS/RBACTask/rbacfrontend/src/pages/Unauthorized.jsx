import React from "react"
import { Result, Button } from "antd"
import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={[
          <Button type="primary" key="dashboard" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>,
          <Button key="login" onClick={() => navigate("/login")}>
            Back to Login
          </Button>,
        ]}
      />
    </div>
  )
}

export default Unauthorized