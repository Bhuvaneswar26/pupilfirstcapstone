```markdown
# 🎓 Pupilfirst Capstone Project

Welcome to the Pupilfirst Capstone Project! This project serves as the culmination of the WD201 course, offered by Pupilfirst. As a Learning Management System (LMS), our goal is to provide a comprehensive platform for educators to create and manage courses, and for students to sign up, enroll in courses, and access learning materials. This project aims to showcase our skills in web development and our understanding of building user-friendly educational platforms.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Tech Stack](#️-tech-stack)
- [Project Architecture](#-project-architecture)
- [Database Schema](#️-database-schema)
- [Project Features](#-project-features)
- [Testing](#-testing)
- [Screenshots](#️-screenshots)

---

## 🛠️ Getting Started

To clone and use this project, follow these steps:

1. Clone the Repository: 
   ```
   git clone https://github.com/Bhuvaneswar26/pupilfirstcapstone.git
   ```

2. Change Directory: 
   ```
   cd pupilfirstcapstone
   ```

3. Install Dependencies: 
   ```
   npm install
   ```

4. Create Database: 
   ```
   npx sequelize db:create
   ```

5. Migrate Migrations: 
   ```
   npx sequelize-cli db:migrate
   ```

6. Start the Application: 
   ```
   npm start
   ```

7. Access the Project: 
   The project will be live at port 4000. You can access it through your web browser using the URL: [bhuvaneswar-lms.onrender.com](https://bhuvaneswar-lms.onrender.com)

## 🛠️ Tech Stack

The project is built using the following technologies:

- Node.js: A JavaScript runtime environment for building server-side applications.
- Express: A web application framework for Node.js, providing features for building web servers and APIs.
- PostgreSQL: A powerful, open-source relational database system.
- Sequelize: An ORM (Object-Relational Mapping) library for Node.js, used to interact with PostgreSQL databases.
- EJS: A simple templating language that lets you generate HTML markup with plain JavaScript.
- Tailwind CSS: A utility-first CSS framework for rapidly building custom designs without ever leaving your HTML.
- Express Generator: A tool to generate the initial project structure for Express applications.

## 🏗️ Project Architecture

The project follows the Model-View-Controller (MVC) architectural pattern for organizing code and separating concerns. This pattern helps maintain a clear and modular structure, making it easier to manage and scale the application over time.

### Model

The Model component represents the data and business logic of the application. In this project, models are responsible for interacting with the database, defining the structure of data, and enforcing validation rules.

### View

The View component is responsible for presenting data to the user and handling user interface interactions. In this project, views are implemented using EJS templates, which allow for dynamic generation of HTML content based on data from the models.

### Controller

The Controller component acts as an intermediary between the model and view. It receives user input, processes requests, and interacts with the model to retrieve data or perform actions. In this project, controllers handle routing logic, validate input, and coordinate the flow of data between the model and view.

## 🗂️ Database Schema

Below is the visual representation of the database schema used in this project:

![Database Schema](lms/public/images/Blankdiagram.png)

## ✨ Project Features

### For Educators

1. Course Management
   - Create new courses by providing a name and description.
   - Organize courses into chapters for clear structure.
   - Add pages to each chapter to populate course content.

2. Enrollment Management
   - View reports on the number of students enrolled in each course.
   - Monitor course popularity based on enrollment numbers.

### For Students

1. User Management
   - Sign up for a new account by providing name, email, and password.
   - Log in using registered email and password.
   - Log out when done with the learning session.

2. Course Enrollment
   - Browse available courses and preview chapters before enrolling.
   - Enroll in courses to gain access to course content.

3. Learning Experience
   - View list of enrolled courses for easy navigation.
   - Mark pages as complete to track learning progress.
   - View progress status in enrolled courses, such as completion percentage.

4. Content Access
   - Access course content organized into chapters and pages.
   - Participate in quizzes or assessments at the end of each chapter (optional feature).

5. Account Management
   - Change password for account security.

## 🧪 Testing

The project includes a comprehensive testing suite implemented with Jest. Jest is a JavaScript testing framework that ensures the reliability and correctness of the application's codebase.

To run the tests, use the following command:

```
npm test
```

Executing this command will initiate the testing process and provide

 feedback on the test results, including any failures or errors encountered during testing.

## 🖼️ Screenshots

### Signup Page

![Signup Page](public\images\signup.png)

### Login Page

![Login Page](public\images\signin.png)
### Student Dashboard

![User Dashboard](ppublic\images\studentdashboard.png)

### Educator Dashboard

![Educator Dashboard](public\images\createcourse.png)

### Create Course

![Create Course](public\images\createcourse.png)

### Preview Course

![Preview Course](public\images\previewcourse.png)

### Reports

![Reports](public\images\reports.png)

### Course View

![Course View](public\images\enrolledcourse.png)

### Profile Updating

![Profile Updating](public\images\profile.png)

### Page View

![Page View](public\images\pageview.png)
```

