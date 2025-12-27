import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

export interface CreateEnrollmentDto {
  studentId: string;
  classId: string;
  subjectId: string;
}

export interface ListEnrollmentsQuery {
  page?: number;
  limit?: number;
  studentId?: string;
  classId?: string;
  subjectId?: string;
}

export const enrollmentService = {
  async create(data: CreateEnrollmentDto) {
    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    // Verify class exists
    const classRecord = await prisma.class.findUnique({
      where: { id: data.classId },
    });

    if (!classRecord) {
      throw new AppError('Class not found', 404);
    }

    // Verify subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: data.subjectId },
    });

    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    // Check if enrollment already exists
    const existingEnrollment = await prisma.studentEnrollment.findUnique({
      where: {
        studentId_classId_subjectId: {
          studentId: data.studentId,
          classId: data.classId,
          subjectId: data.subjectId,
        },
      },
    });

    if (existingEnrollment) {
      throw new AppError('Student is already enrolled in this class and subject', 409);
    }

    const enrollment = await prisma.studentEnrollment.create({
      data: {
        studentId: data.studentId,
        classId: data.classId,
        subjectId: data.subjectId,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        class: true,
        subject: true,
      },
    });

    return enrollment;
  },

  async findById(id: string) {
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        class: true,
        subject: true,
      },
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    return enrollment;
  },

  async list(query: ListEnrollmentsQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.studentId) {
      where.studentId = query.studentId;
    }

    if (query.classId) {
      where.classId = query.classId;
    }

    if (query.subjectId) {
      where.subjectId = query.subjectId;
    }

    const [enrollments, total] = await Promise.all([
      prisma.studentEnrollment.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
          class: true,
          subject: true,
        },
        orderBy: { enrolledAt: 'desc' },
      }),
      prisma.studentEnrollment.count({ where }),
    ]);

    return {
      data: enrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async delete(id: string) {
    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id },
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    await prisma.studentEnrollment.delete({
      where: { id },
    });

    return { message: 'Enrollment deleted successfully' };
  },
};

