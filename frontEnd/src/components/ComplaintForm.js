import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ComplaintForm = ({ initialValues, onCancel }) => {
  const [form] = Form.useForm();
  const [successMessage, setSuccessMessage] = useState('');

  // Function to get the current date and time in the required format (DD-MM-YYYY)
  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (values) => {
    try {
      // Add the current date to the values object before sending to the backend
      values.date = getCurrentDate();

      const response = await axios.post('http://localhost:5000/api/save-complaint', values);

      if (response.status === 200) {
        setSuccessMessage('Complaint submitted successfully!');
        form.resetFields();
      } else {
        message.error('Failed to submit complaint.');
      }
    } catch (error) {
      message.error('Failed to submit complaint.');
    }
  };

  return (
    <div className="complaint-form-container">
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item
          name="aadhaar"
          label="Aadhaar Number"
          rules={[
            { required: true, message: 'Please enter your Aadhaar Number' },
            { len: 12, message: 'Aadhaar Number should be exactly 12 characters long' },
          ]}
        >
          <Input placeholder="Enter your Aadhaar Number" />
        </Form.Item>
        <Form.Item
        name="phoneNumber"
        label="Phone Number"
        rules={[
        { required: true, message: 'Please enter your Phone Number' },
        { pattern: /^(\+91)?\d{10}$/, message: 'Phone Number should be in the format +91XXXXXXXXXX (10 digits)' },
        ]}
        //initialValue="+91"
        >
        <Input addonBefore="+91" placeholder="Enter your Phone Number (10 digits)" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input placeholder="Enter your address" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          initialValue={getCurrentDate()} // Set the initial value to the current date
          rules={[{ required: true, message: 'Please select the date' }]}
        >
          <Input disabled style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select a category">
            <Option value="Call/ SMS Service Unavailable">Call/ SMS Service Unavailable</Option>
            <Option value="Other">Other</Option>
            {/* Add more options as needed */}
          </Select>
        </Form.Item>
        <Form.Item
          name="complaint"
          label="Complaint"
          rules={[{ required: true, message: 'Please enter your complaint' }]}
        >
          <Input.TextArea placeholder="Enter your complaint" rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="default" onClick={onCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ComplaintForm;
