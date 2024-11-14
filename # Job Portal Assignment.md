# Job Portal Assignment

## Objective
Develop a comprehensive job portal that offers a user-friendly interface for job seekers to explore job listings and company profiles. This project focuses on front-end development with React, session management, and dynamic content rendering. The portal will include a login page connected to a previous Node.js assignment, allowing users to log in with usernames and passwords stored on the backend.

This project is a foundation that will be further improved in future assignments, so a well-organized folder structure is essential.

## Technologies Used
- **Front-end**: React, Axios, Material UI (optional)
- **Back-end**: Node.js, Express, JWT (for authentication)
- **UI Frameworks**: Material UI (optional), with the option to use alternatives like Bootstrap or CSS for this assignment.

## Features
- **Job Listings**: Users can explore job opportunities listed on the platform.
- **Company Profiles**: Each job listing can link to a detailed company profile.
- **Login Page with JWT Authentication**: Users log in with existing usernames and passwords, and their session is managed with JSON Web Tokens (JWT).
- **Session Management**: JWT-based session management to maintain user login state.
- **Dynamic Content Rendering**: Job listings and company profiles are dynamically fetched and displayed.

## Folder Structure
The project follows a REST API folder hierarchy with the following structure:



### File Descriptions
- **Server.js**: The entry point of the backend server, initializing the Express app and defining middleware.
- **router.js**: Defines the routing logic for different endpoints.
- **controller.js**: Handles the business logic of the application.
- **service.js**: Contains data processing logic separate from the controllers.
- **model.js**: Defines the database schemas/models used by the app.

## Setup Instructions

### Prerequisites
- **Node.js**: Ensure Node.js is installed to run the backend server.
- **React**: Set up the front-end environment with Create React App or similar.

### Backend Setup
1. Clone this repository.
2. Navigate to the `server` directory:
   ```bash
   cd server


   

