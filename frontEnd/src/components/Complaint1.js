import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tag } from 'antd';
import axios from 'axios';

const Complaint1 = () => {
  const [complaints, setComplaints] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get-complaints');
      setComplaints(response.data);
      console.log('Fetched complaints:', response.data);
    } catch (error) {
      console.log('Error fetching complaints:', error);
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const handleRemoveComplaint = async (complaintId) => {
    try {
      await axios.delete(`http://localhost:5000/api/complaintList/${complaintId}`);
      setComplaints((prevComplaints) => prevComplaints.filter((complaint) => complaint._id !== complaintId));
      console.log('Complaint removed successfully');
    } catch (error) {
      console.error('Failed to remove complaint:', error);
    }
  };

  const handleMarkSolved = async (complaintId) => {
    try {
      await axios.put(`http://localhost:5000/api/markAsSolved/${complaintId}`, { isSolved: true });
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, isSolved: true } : complaint
        )
      );
      console.log('Complaint marked as solved successfully');
    } catch (error) {
      console.error('Failed to mark complaint as solved:', error);
    }
  };

  const handleMarkUnsolved = async (complaintId) => {
    try {
      await axios.put(`http://localhost:5000/api/complaintSolved/${complaintId}`, { isSolved: false });
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, isSolved: false } : complaint
        )
      );
      console.log('Complaint marked as unsolved successfully');
    } catch (error) {
      console.error('Failed to mark complaint as unsolved:', error);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Aadhaar Number',
      dataIndex: 'aadhaar',
      key: 'aadhaar', // Change 'aadhaarNumber' to 'aadhaar'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },    
    {
      
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    // {
      // title: 'Address',
      // dataIndex: 'address',
      // key: 'address',
    // },
    // {
      // title: 'Email',
      // dataIndex: 'email',
      // key: 'email',
    // },
    {
      title: 'Complaint',
      dataIndex: 'complaint',
      key: 'complaint',
    },
    // ... existing columns
    {
      title: 'Action',
      key: 'action',
      render: (_, complaint) => (
        <>
          <Button type="primary" onClick={() => handleViewDetails(complaint)}>
            View Details
          </Button>
          <span>
            <Button type="text" danger onClick={() => handleRemoveComplaint(complaint._id)}>
              Remove
            </Button>
            {complaint.isSolved ? (
              <Button type="text" style={{ color: 'green' }} onClick={() => handleMarkUnsolved(complaint._id)}>
                Solved
              </Button>
            ) : (
              <Button type="text" onClick={() => handleMarkSolved(complaint._id)}>
                Mark Solved
              </Button>
            )}
          </span>
        </>
      ),
    },
  ];

  return (
    <div>
      <h3>Complaints</h3>
      <Table dataSource={complaints} columns={columns} rowKey="_id" />
      <Modal
        title="Complaint Details"
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => setModalOpen(false)}
      >
        {selectedComplaint && (
          <div>
            <h3>Complaint Details</h3>
            <p>Date: {selectedComplaint.date}</p>
            <p>Name: {selectedComplaint.name}</p>
            <p>Aadhaar Number: {selectedComplaint.aadhaar}</p>
            <p>Category : {selectedComplaint.category}</p>
            <p>Phone Number: {selectedComplaint.phoneNumber}</p>
            <p>Address: {selectedComplaint.address}</p>
            <p>Email: {selectedComplaint.email}</p>
            <p>Complaint: {selectedComplaint.complaint}</p>
            <p>Status: {selectedComplaint.isSolved ? <Tag color="green">Solved</Tag> : <Tag>Unsolved</Tag>}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Complaint1;
