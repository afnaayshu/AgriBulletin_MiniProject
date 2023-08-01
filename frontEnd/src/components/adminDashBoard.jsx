import React, { useState } from 'react';
import { PhoneOutlined, MessageOutlined, NotificationOutlined, FilePdfOutlined, DeleteOutlined } from '@ant-design/icons';
import { Divider, Input, Checkbox, Button, Form, message, Modal, Table, DatePicker } from 'antd';
import './Admin.css';
import { format } from 'date-fns';
import Complaint1 from './Complaint1';
import axios from 'axios';
const AdminDashboard = () => {
  const [messageText, setMessageText] = useState('');
  const [schemeNameNotification, setSchemeNameNotification] = useState('');
  const [automatedCall, setAutomatedCall] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [notificationUpdate, setNotificationUpdate] = useState(false);
  const [schemeSubmitted, setSchemeSubmitted] = useState(false);
  const [schemeData, setSchemeData] = useState(null);
  const [schemeName, setSchemeName] = useState('');
  const [schemeDescription, setSchemeDescription] = useState('');
  const [schemeCategory, setSchemeCategory] = useState('');
  const [schemeType, setSchemeType] = useState('');
  const [members, setMembers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [viewComplaints, setViewComplaints] = useState(false);
  const [viewMembers, setViewMembers] = useState(false);
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [schemeStartDate, setSchemeStartDate] = useState(null);
const [notificationDate, setNotificationDate] = useState('');

const handleMakeChanges = async () => {
  if (automatedCall) {
    console.log('Trigger automated call');
    try {
      await axios.post('http://localhost:5000/api/send-notification');
      console.log('Automated call triggered');
    } catch (error) {
      console.error('Failed to trigger automated call:', error);
    }
  }

  if (messageSent) {
    console.log('Send message:', messageText);
    try {
      await axios.post('http://localhost:5000/api/save-notification', {
        messageText,
        schemeNameNotification,
      });
      // Handle the response or perform any other required action
      console.log('Notification saved and SMS sent successfully');
    } catch (error) {
      console.error('Failed to save notification and send SMS:', error);
    }
  }
  if (notificationUpdate) {
    console.log('Update notification');
    try {
      if (notificationDate) {
        await axios.post('http://localhost:5000/api/save-notification', {
          messageText,
          schemeNameNotification,
          notificationDate, // Pass the date string directly without converting it to a Date object
        });
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  }
};


  // const handleMakeChanges = async () => {
    // if (automatedCall) {
      // console.log('Trigger automated call');
      // try {
        // await axios.post('http://localhost:5000/api/send-notification');
        // console.log('Automated call triggered');
      // } catch (error) {
        // console.error('Failed to trigger automated call:', error);
      // }
    // }
  // 
    // if (messageSent) {
      // console.log('Send message:', messageText);
      // try {
        // await axios.post('http://localhost:5000/api/save-notification', { messageText, schemeNameNotification });
        //Handle the response or perform any other required action
        // console.log('Notification saved and SMS sent successfully');
      // } catch (error) {
        // console.error('Failed to save notification and send SMS:', error);
      // }}
      // if (notificationUpdate) {
        // console.log('Update notification');
        // try {
          // if (notificationDate) {
            //Create a new Date object from the notificationDate string
            // const dateObj = new Date(notificationDate);
      // 
           // Format the date to 'DD-MM-YYYY'
            // const formattedNotificationDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
      // 
            // await axios.post('http://localhost:5000/api/save-notification', {
              // messageText,
              // schemeNameNotification,
              // notificationDate: formattedNotificationDate,
            // });
          // }
        // } catch (error) {
          // console.error('Error updating notification:', error);
        // }
      // }
      // 
      // 
    // };
  //  
  
    // if (notificationUpdate) {
      // console.log('Update notification');
      // try {
        // const response=await axios.get('http://localhost:5000/api/notifications');
        // 
        // const notifications=response.data;
      //  Update the UI or perform any other required action
        // console.log('Notifications :',notifications);
      // } catch (error) {
        // console.error('Failed to get notifications:', error);
      // }
    // }

  const handleClearMessage = () => {
    setMessageText('');
  };

  const handleClearInput = () => {
    setSchemeName('');
    setSchemeDescription('');
    setSchemeCategory('');
    setSchemeType('');
  };
  const handleSchemeSubmit = async () => {
  try {
    await axios.post('http://localhost:5000/api/submit-scheme', {
      schemename:schemeName,
      description: schemeDescription,
      category: schemeCategory,
      type: schemeType,
    });
    message.success('Scheme submitted successfully');
    handleClearInput();
  } catch (error) {
    console.error('Failed to submit scheme:', error);
    message.error('Failed to submit scheme');
  }
};

  const handleAddMember = () => {
    setAddMemberVisible(true);
  };

  const handleToggleComplaints = async () => {
    if (viewComplaints) {
      setViewComplaints(false);
    } else {
      try {
        const response = await axios.get('http://localhost:5000/api/get-complaints');
        const complaintsData = response.data;
        setComplaints(complaintsData); // Update the complaints state variable with the fetched data
        setViewComplaints(true); // Show the complaints table
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      }
    }
  };
  

  const handleViewMembers = async () => {
    if (viewMembers) {
      setViewMembers(false);
    } else {
      try {
        const response = await axios.get('http://localhost:5000/api/memberview');
        const membersData = response.data;
        console.log(membersData)
        setMembers(membersData); // Update the members state variable with the fetched data
        setViewMembers(true); // Show the members table
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    }
  };
  

  const handleAddMemberSubmit = async (values) => {
    const newMember = {
      name: values.name,
      aadhaar : values.aadhaar,
      phoneNumber: values.phoneNumber,
      email: values.email,
      address: values.address,
    };
    axios.post('http://localhost:5000/api/add_member', newMember)
      .then((response) => {
        console.log(response.data);
        message.success('Member added successfully');
        setAddMemberVisible(false);
      })
      .catch((error) => {
        console.error(error);
        message.error('Failed to add member');
      });

    
  };
  const handleRemoveMember = async (record) => {
    try {
      // Show loading state
      setViewMembers(false);
  
      // Send a request to the server to remove the member
      await axios.delete(`http://localhost:5000/api/memberDelete/${record._id}`);
  
      // Remove the member from the state
      setMembers((prevMembers) => prevMembers.filter((member) => member._id !== record._id));
  
      // Hide loading state and show the updated table
      setViewMembers(true);
  
      message.success('Member removed successfully');
    } catch (error) {
      console.error('Failed to remove member:', error);
      message.error('Failed to remove member');
    }
  };
  

  const handleRemoveComplaint = (complaint) => {
    const updatedComplaints = complaints.filter((c) => c.id !== complaint.id);
    setComplaints(updatedComplaints);
    message.success('Complaint removed successfully');
  };
  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Aadhaar number',
      dataIndex: 'aadhaar', // Use 'aadhaar' instead of 'aadhaarNumber'
      key: 'aadhaar', // Use 'aadhaar' instead of 'aadhaarNumber'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveMember(record)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const handleLogout = () => {
    window.location.href = '/AdminLogin';
  };

  const handleLoadURL = () => {
    window.open('https://console.twilio.com/us1/develop/phone-numbers/manage/verified', '_blank');
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <Divider className="section-divider">Notification Update</Divider>
      <div className="notification-update">


        <Input.TextArea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Enter your message"
        />
        {/* Use Input for manual date input */}
        <Input
          value={notificationDate}
          onChange={(e) => setNotificationDate(e.target.value)}
          placeholder="Enter notification date (DD-MM-YYYY)"
        />


        <Input
          value={schemeNameNotification}
          onChange={(e) => setSchemeNameNotification(e.target.value)}
          placeholder="Enter scheme name"
        />

        <Checkbox
          checked={notificationUpdate}
          onChange={() => setNotificationUpdate(!notificationUpdate)}
          className="notification-checkbox"
        >
          <NotificationOutlined />
          Update Notification
        </Checkbox>

        <Checkbox
          checked={automatedCall}
          onChange={() => setAutomatedCall(!automatedCall)}
          className="notification-checkbox"
        >
          <PhoneOutlined />
          Automated Call
        </Checkbox>

        <Checkbox
          checked={messageSent}
          onChange={() => setMessageSent(!messageSent)}
          className="notification-checkbox"
        >
          <MessageOutlined />
          Message Sent
        </Checkbox>

        <Button type="primary" onClick={handleMakeChanges} className="action-button">
          Make Changes
        </Button>
        <Button type="primary" onClick={handleClearMessage} className="action-button">
          Clear Message
        </Button>
      </div>

      <Divider className="section-divider">Update Scheme</Divider>
      <div className="update-scheme">
        <Form layout="vertical">
          <Form.Item label="Scheme Name">
            <Input value={schemeName} onChange={(e) => setSchemeName(e.target.value)} />
          </Form.Item>

          <Form.Item label="Description">
            <Input.TextArea value={schemeDescription} onChange={(e) => setSchemeDescription(e.target.value)} />
          </Form.Item>

          <Form.Item label="Category">
            <Input value={schemeCategory} onChange={(e) => setSchemeCategory(e.target.value)} />
          </Form.Item>
          <Form.Item label="Start Date">
          <DatePicker
            placeholder="Select date"
            value={schemeStartDate}
            onChange={(date) => setSchemeStartDate(date)}
            format="DD-MM-YYYY"
            className="scheme-start-date-picker"
          />
           </Form.Item>
          <Form.Item label="Type">
            <Input value={schemeType} onChange={(e) => setSchemeType(e.target.value)} />
          </Form.Item>

          <Button type="primary" onClick={handleClearInput} className="action-button">
            Clear Input
          </Button>

          <Button
            type="primary" onClick={handleSchemeSubmit}
            className="action-button"
          >
            Submit Scheme
          </Button>
        </Form>
      </div>

      <Divider className="section-divider">Manage Members</Divider>
      <div className="manage-members">
        <Button type="primary" onClick={handleAddMember} className="action-button">
          Add Member
        </Button>

        <Button type="primary" onClick={handleViewMembers} className="action-button">
          {viewMembers ? 'Hide Members' : 'View Members'}
        </Button>

        <Button type="primary" onClick={handleLoadURL} className="action-button">
          Register Phno.
        </Button>

        {viewMembers && (
          <Table columns={columns} dataSource={members} pagination={false} className="members-table" />
        )}
      </div>

      <Divider className="section-divider">View Complaints</Divider>
      <div className="view-complaints">
        <Button type="primary" onClick={handleToggleComplaints} className="action-button">
          {viewComplaints ? 'Hide Complaints' : 'View Complaints'}
        </Button>
        {viewComplaints && <Complaint1 complaints={complaints} />}
      </div>

      <Button type="primary" onClick={handleLogout} className="logout-button">
        Logout
      </Button>
      <footer className='footer'>AgriBulletin</footer>

      <Modal
        visible={addMemberVisible}
        title="Add Member"
        onCancel={() => setAddMemberVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddMemberSubmit} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
          name="aadhaar"
          label="Aadhaar Number"
          rules={[
          { required: true, message: 'Please enter the Aadhaar Number' },
          { len: 12, message: 'Aadhaar Number should be exactly 12 characters long' },
          ]}
          >
          <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: 'Please enter the phone number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter the email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please enter the address' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;