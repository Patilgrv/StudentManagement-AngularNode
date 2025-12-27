# Student Management Application

A production-ready full-stack Student Management System built with Angular, Node.js, Express, TypeScript, PostgreSQL, and Prisma.

## Features

### Backend
- **Authentication**: JWT-based authentication with role-based authorization
- **User Management**: CRUD operations for users (ADMIN only)
- **Student Management**: Complete student profile management
- **Teacher Management**: Teacher profile and assignment management
- **Class Management**: Class creation and management
- **Subject Management**: Subject management with teacher assignments
- **Enrollment System**: Student enrollment in classes and subjects
- **Attendance System**: Mark and track student attendance with reports

### Frontend
- **Role-based Dashboards**: Separate dashboards for ADMIN, TEACHER, and STUDENT
- **Authentication UI**: Login page with form validation
- **CRUD Interfaces**: Full CRUD operations for all entities
- **Responsive Design**: Material Design components
- **Route Guards**: Authentication and role-based route protection

## Tech Stack

### Backend
- Node.js with Express 5.2.1
- TypeScript 5.9.3
- PostgreSQL with Prisma ORM 5.22.0
- JWT for authentication
- bcrypt for password hashing
- Zod for validation

### Frontend
- Angular 18 (Standalone Components)
- Angular Material
- RxJS
- TypeScript

## Project Structure

```
StudentManagement/
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Express app entry
│   │   ├── config/                # Configuration files
│   │   ├── middleware/            # Express middlewares
│   │   ├── utils/                 # Utility functions
│   │   ├── features/              # Feature modules
│   │   └── routes/                # Route definitions
│   └── prisma/
│       └── schema.prisma          # Database schema
├── frontend/
│   └── src/
│       └── app/
│           ├── core/              # Core services, guards, interceptors
│           └── features/         # Feature modules
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/student_management?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=http://localhost:4200
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will run on `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (ADMIN only)

### Users
- `GET /api/users` - List users (ADMIN only)
- `GET /api/users/:id` - Get user (ADMIN only)
- `POST /api/users` - Create user (ADMIN only)
- `PUT /api/users/:id` - Update user (ADMIN only)
- `DELETE /api/users/:id` - Delete user (ADMIN only)

### Students
- `GET /api/students` - List students
- `GET /api/students/:id` - Get student
- `POST /api/students` - Create student (ADMIN only)
- `PUT /api/students/:id` - Update student (ADMIN only)
- `DELETE /api/students/:id` - Delete student (ADMIN only)

### Teachers
- `GET /api/teachers` - List teachers (ADMIN only)
- `GET /api/teachers/:id` - Get teacher
- `POST /api/teachers` - Create teacher (ADMIN only)
- `PUT /api/teachers/:id` - Update teacher (ADMIN only)
- `DELETE /api/teachers/:id` - Delete teacher (ADMIN only)

### Classes
- `GET /api/classes` - List classes
- `GET /api/classes/:id` - Get class
- `POST /api/classes` - Create class (ADMIN only)
- `PUT /api/classes/:id` - Update class (ADMIN only)
- `DELETE /api/classes/:id` - Delete class (ADMIN only)

### Subjects
- `GET /api/subjects` - List subjects
- `GET /api/subjects/:id` - Get subject
- `POST /api/subjects` - Create subject (ADMIN only)
- `PUT /api/subjects/:id` - Update subject (ADMIN only)
- `DELETE /api/subjects/:id` - Delete subject (ADMIN only)
- `POST /api/subjects/:id/assign-teacher` - Assign teacher (ADMIN only)
- `DELETE /api/subjects/:id/unassign-teacher/:teacherId` - Unassign teacher (ADMIN only)

### Enrollments
- `GET /api/enrollments` - List enrollments
- `GET /api/enrollments/:id` - Get enrollment
- `POST /api/enrollments` - Create enrollment (ADMIN only)
- `DELETE /api/enrollments/:id` - Delete enrollment (ADMIN only)

### Attendance
- `GET /api/attendance` - List attendance
- `GET /api/attendance/:id` - Get attendance record
- `GET /api/attendance/student/:studentId` - Get student attendance
- `POST /api/attendance` - Mark attendance (TEACHER only)
- `PUT /api/attendance/:id` - Update attendance (TEACHER only)
- `GET /api/attendance/reports` - Get attendance reports

## Roles and Permissions

### ADMIN
- Full access to all features
- User management
- Student, Teacher, Class, Subject management
- View all attendance records and reports

### TEACHER
- View students, classes, and subjects
- Mark and update attendance
- View attendance reports

### STUDENT
- View own profile
- View own attendance records

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with Zod
- Rate limiting
- CORS configuration
- Secure HTTP headers

## Development

### Backend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:
- User (authentication and authorization)
- Student (linked to User)
- Teacher (linked to User)
- Class
- Subject
- SubjectAssignment (Teacher-Subject relationship)
- StudentEnrollment (Student-Class-Subject relationship)
- Attendance

## License

ISC

