import { Router } from 'express';
import { authController } from '../features/auth/auth.controller';
import { userController } from '../features/users/user.controller';
import { studentController } from '../features/students/student.controller';
import { teacherController } from '../features/teachers/teacher.controller';
import { classController } from '../features/classes/class.controller';
import { subjectController } from '../features/subjects/subject.controller';
import { enrollmentController } from '../features/enrollments/enrollment.controller';
import { attendanceController } from '../features/attendance/attendance.controller';

import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validator.middleware';

import { loginSchema, registerSchema } from '../features/auth/auth.validator';
import { createUserSchema, updateUserSchema, getUserSchema, listUsersSchema } from '../features/users/user.validator';
import {
  createStudentSchema,
  updateStudentSchema,
  getStudentSchema,
  listStudentsSchema,
} from '../features/students/student.validator';
import {
  createTeacherSchema,
  updateTeacherSchema,
  getTeacherSchema,
  listTeachersSchema,
} from '../features/teachers/teacher.validator';
import { createClassSchema, updateClassSchema, getClassSchema, listClassesSchema } from '../features/classes/class.validator';
import {
  createSubjectSchema,
  updateSubjectSchema,
  getSubjectSchema,
  listSubjectsSchema,
  assignTeacherSchema,
  unassignTeacherSchema,
} from '../features/subjects/subject.validator';
import { createEnrollmentSchema, getEnrollmentSchema, listEnrollmentsSchema } from '../features/enrollments/enrollment.validator';
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  getAttendanceSchema,
  listAttendanceSchema,
  getStudentAttendanceSchema,
  getAttendanceReportsSchema,
} from '../features/attendance/attendance.validator';

const router = Router();

// Auth routes (public)
router.post('/auth/login', validate(loginSchema), authController.login);
router.post('/auth/register', validate(registerSchema), authenticate, authorize('ADMIN'), authController.register);

// User routes (ADMIN only)
router.get('/users', authenticate, authorize('ADMIN'), validate(listUsersSchema), userController.list);
router.get('/users/:id', authenticate, authorize('ADMIN'), validate(getUserSchema), userController.findById);
router.post('/users', authenticate, authorize('ADMIN'), validate(createUserSchema), userController.create);
router.put('/users/:id', authenticate, authorize('ADMIN'), validate(updateUserSchema), userController.update);
router.delete('/users/:id', authenticate, authorize('ADMIN'), validate(getUserSchema), userController.delete);

// Student routes
router.get('/students', authenticate, authorize('ADMIN', 'TEACHER'), validate(listStudentsSchema), studentController.list);
router.get('/students/:id', authenticate, authorize('ADMIN', 'TEACHER', 'STUDENT'), validate(getStudentSchema), studentController.findById);
router.post('/students', authenticate, authorize('ADMIN'), validate(createStudentSchema), studentController.create);
router.put('/students/:id', authenticate, authorize('ADMIN'), validate(updateStudentSchema), studentController.update);
router.delete('/students/:id', authenticate, authorize('ADMIN'), validate(getStudentSchema), studentController.delete);

// Teacher routes
router.get('/teachers', authenticate, authorize('ADMIN'), validate(listTeachersSchema), teacherController.list);
router.get('/teachers/:id', authenticate, authorize('ADMIN', 'TEACHER'), validate(getTeacherSchema), teacherController.findById);
router.post('/teachers', authenticate, authorize('ADMIN'), validate(createTeacherSchema), teacherController.create);
router.put('/teachers/:id', authenticate, authorize('ADMIN'), validate(updateTeacherSchema), teacherController.update);
router.delete('/teachers/:id', authenticate, authorize('ADMIN'), validate(getTeacherSchema), teacherController.delete);

// Class routes
router.get('/classes', authenticate, authorize('ADMIN', 'TEACHER'), validate(listClassesSchema), classController.list);
router.get('/classes/:id', authenticate, authorize('ADMIN', 'TEACHER'), validate(getClassSchema), classController.findById);
router.post('/classes', authenticate, authorize('ADMIN'), validate(createClassSchema), classController.create);
router.put('/classes/:id', authenticate, authorize('ADMIN'), validate(updateClassSchema), classController.update);
router.delete('/classes/:id', authenticate, authorize('ADMIN'), validate(getClassSchema), classController.delete);

// Subject routes
router.get('/subjects', authenticate, authorize('ADMIN', 'TEACHER'), validate(listSubjectsSchema), subjectController.list);
router.get('/subjects/:id', authenticate, authorize('ADMIN', 'TEACHER'), validate(getSubjectSchema), subjectController.findById);
router.post('/subjects', authenticate, authorize('ADMIN'), validate(createSubjectSchema), subjectController.create);
router.put('/subjects/:id', authenticate, authorize('ADMIN'), validate(updateSubjectSchema), subjectController.update);
router.delete('/subjects/:id', authenticate, authorize('ADMIN'), validate(getSubjectSchema), subjectController.delete);
router.post('/subjects/:id/assign-teacher', authenticate, authorize('ADMIN'), validate(assignTeacherSchema), subjectController.assignTeacher);
router.delete('/subjects/:id/unassign-teacher/:teacherId', authenticate, authorize('ADMIN'), validate(unassignTeacherSchema), subjectController.unassignTeacher);

// Enrollment routes
router.get('/enrollments', authenticate, authorize('ADMIN', 'TEACHER'), validate(listEnrollmentsSchema), enrollmentController.list);
router.get('/enrollments/:id', authenticate, authorize('ADMIN', 'TEACHER'), validate(getEnrollmentSchema), enrollmentController.findById);
router.post('/enrollments', authenticate, authorize('ADMIN'), validate(createEnrollmentSchema), enrollmentController.create);
router.delete('/enrollments/:id', authenticate, authorize('ADMIN'), validate(getEnrollmentSchema), enrollmentController.delete);

// Attendance routes
router.get('/attendance', authenticate, authorize('ADMIN', 'TEACHER'), validate(listAttendanceSchema), attendanceController.list);
router.get('/attendance/:id', authenticate, authorize('ADMIN', 'TEACHER'), validate(getAttendanceSchema), attendanceController.findById);
router.get('/attendance/student/:studentId', authenticate, authorize('ADMIN', 'TEACHER', 'STUDENT'), validate(getStudentAttendanceSchema), attendanceController.getStudentAttendance);
router.post('/attendance', authenticate, authorize('TEACHER'), validate(createAttendanceSchema), attendanceController.create);
router.put('/attendance/:id', authenticate, authorize('TEACHER'), validate(updateAttendanceSchema), attendanceController.update);
router.get('/attendance/reports', authenticate, authorize('ADMIN', 'TEACHER'), validate(getAttendanceReportsSchema), attendanceController.getReports);

export default router;

