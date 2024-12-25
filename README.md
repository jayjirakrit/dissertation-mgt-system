# Dissertation Management System

This is a system for managing dissertation reports, built using Vue.js for the frontend and Node.js for the backend. It uses `json-server` as a mock database to simulate API calls for the system.

## Installation Guide

### Prerequisites

Before setting up the system, you need to have the following installed:

- **Node.js**: Used for the backend side of the application.
- **Vue.js**: Frontend framework.
- **json-server**: A simple, local REST API server for mock data.

### Installation Steps

Follow these steps to set up the system on your local machine:

### 1. Clone the Repository

Clone the repository using Git to get a copy of the project:

```bash
git clone https://github.com/jayjirakrit/dissertation-mgt-system.git
```

### 2. Install Node Js Dependencies

```bash
npm install --save
```

### 3. Start node-js server 

```bash
npm run serve
```

### 4. Install json-server 

```bash
npm install -g json-server
```

### 5. Start json-server 

```bash
json-server --watch ./data/db.json  
```

## User Roles

### Student:

username: student<br>
password: password

### Teacher

username: teacher<br>
password: password

### Admin

username: admin<br>
password: password

## Data Dictionary

### Users

- **id**: "1"  
- **firstName**: "John"  
- **lastName**: "Doe"  
- **major**: "Computer Science"  
- **role**: "student"  
- **username**: "student"  
- **password**: "password"  
- **teacherId**: "2"  
- **createdDatetime**: "2024-12-24T04:14:06.752675" 

## Student Assignments

- **id**: "2"  
- **userId**: "1"  
- **progressReportId**: "10"  
- **progressReportStatus**: "Not Submitted"  
- **finalReportId**: "11"  
- **finalReportStatus**: "Not Submitted"  
- **teacherId**: "2"  
- **grade**: "A"  
- **gradedStatus**: "Graded"  
- **createdDatetime**: "2024-12-24T04:14:06.752675"  

## Reports

- **id**: "10"  
- **name**: "J_Y_Progress_Report.pdf"  
- **document**: "base64content"  
- **type**: "progress"  
- **time_stamp**: "2024-12-24T04:14:06.752675"  