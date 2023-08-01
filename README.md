# AGRIBULLETIN

## Rural Agricultural Resources Portal

### Abstract

In many rural areas (panchayats), the delivery of agricultural resources such as seeds, saplings, and schemes is hindered by ineffective methods of information dissemination, which can include relying on newspapers or WhatsApp groups to inform residents of available resources and how to access them. This can result in missed opportunities for many people who are unaware of the resources that are available to them.

To address this issue, we propose a solution - the Rural Agricultural Resources Portal. This platform serves as a catalog of available resources, providing information on the availability status of resources, notifications of new developments and opportunities, and a help/complaint feature for individuals experiencing difficulties in accessing resources.

The Rural Agricultural Resources Portal ensures that information is accessible to everyone in the community. It uses automated calls and SMS to deliver updates in the local language, making it inclusive and easy to use for all residents, even those who are not tech-savvy. The platform includes automated announcement features that provide step-by-step instructions on how to access resources.

Furthermore, the platform empowers relevant authorities to update and manage the data, ensuring that the information remains up-to-date and accurate.

### Key Features

- Catalog of Agricultural Resources: The portal serves as a comprehensive catalog of available agricultural resources, including seeds, saplings, and schemes.

- Availability Status: Users can check the availability status of resources to plan and make informed decisions.

- Notifications: Residents receive timely updates and notifications of new developments and opportunities in the local language through automated calls and SMS.

- Help and Complaint Feature: A dedicated section allows users to seek assistance or report issues they face in accessing resources.

- User-Friendly Interface: The website is designed with an intuitive and user-friendly interface to accommodate users with varying levels of technical expertise.

- Automated Announcements: Step-by-step instructions are provided through automated announcements to guide users in accessing resources.

- Data Management: Relevant authorities have access to update and manage the data, ensuring accuracy and up-to-date information.

### Project Structure

The project is organized into the following components:

1. **Components**: This directory contains various React components that form the user interface of the portal. It includes:

   - `AdminDashboard.jsx`: The admin dashboard interface for managing and updating data on the platform.

   - `ComplaintForm.js`: A form component to submit complaints and seek assistance.

   - `Complaint1.js`: A section to view and respond to user complaints.

   - `Notifications.js`: The notification component that displays updates and new opportunities.

   - `Schemes.js`: A section to view and manage agricultural schemes.

2. **Backend**: This directory contains the backend code responsible for handling API requests and data management. It includes:

   - `main.py`: The main backend file that handles API routes and connects with the database.

   - `automated_call.py`: A module to automate call functionalities for delivering notifications.

   - `sms_service.py`: A module for sending SMS notifications to residents.

3. **Database**: The database directory stores the MongoDB database used to store and manage resource information.

### Setup Instructions

To run the Rural Agricultural Resources Portal locally, follow these steps:

1. Clone the repository from [GitHub Repository URL].
2. Navigate to the project root directory and set up the backend by running `npm install` and `npm start`.
3. Install the required Python packages for the backend by running `pip install -r requirements.txt`.
4. Start the backend server by running `python main.py`.
5. Ensure MongoDB is installed and running on your machine. Connect the backend to the database by updating the MongoDB URL in `main.py`.
6. Access the portal at `http://localhost:3000` in your web browser.

### Conclusion

The Rural Agricultural Resources Portal is a transformative solution designed to improve the accessibility of agricultural resources in rural communities. By providing comprehensive information, timely notifications, and user-friendly features, the platform aims to enhance agricultural productivity and livelihoods for residents. With the capability for authorities to manage and update data, the portal remains accurate and effective in serving the needs of the community.

Through this project, we envision empowering rural residents with vital information and bridging the gap in agricultural resource distribution. The Rural Agricultural Resources Portal has the potential to foster sustainable growth and development in rural farming communities, ultimately contributing to the economic and social well-being of the entire region.
