import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

export interface CreateStudentDto {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
}

export interface ListStudentsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export const studentService = {
  async create(data: CreateStudentDto) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role !== 'STUDENT') {
      throw new AppError('User must have STUDENT role', 400);
    }

    const existingStudent = await prisma.student.findUnique({
      where: { userId: data.userId },
    });

    if (existingStudent) {
      throw new AppError('Student profile already exists for this user', 409);
    }

    const student = await prisma.student.create({
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        phone: data.phone,
        address: data.address,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return student;
  },

  async findById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    return student;
  },

  async list(query: ListStudentsQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { user: { email: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where }),
    ]);

    return {
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(id: string, data: UpdateStudentDto) {
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    const updateData: any = {};

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return updatedStudent;
  },

  async delete(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    await prisma.student.delete({
      where: { id },
    });

    return { message: 'Student deleted successfully' };
  },
};

