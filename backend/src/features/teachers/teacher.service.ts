import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

export interface CreateTeacherDto {
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
}

export interface ListTeachersQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export const teacherService = {
  async create(data: CreateTeacherDto) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role !== 'TEACHER') {
      throw new AppError('User must have TEACHER role', 400);
    }

    const existingTeacher = await prisma.teacher.findUnique({
      where: { userId: data.userId },
    });

    if (existingTeacher) {
      throw new AppError('Teacher profile already exists for this user', 409);
    }

    const teacher = await prisma.teacher.create({
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        department: data.department,
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

    return teacher;
  },

  async findById(id: string) {
    const teacher = await prisma.teacher.findUnique({
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

    if (!teacher) {
      throw new AppError('Teacher not found', 404);
    }

    return teacher;
  },

  async list(query: ListTeachersQuery) {
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

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
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
      prisma.teacher.count({ where }),
    ]);

    return {
      data: teachers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(id: string, data: UpdateTeacherDto) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new AppError('Teacher not found', 404);
    }

    const updateData: any = {};

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.department !== undefined) updateData.department = data.department;

    const updatedTeacher = await prisma.teacher.update({
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

    return updatedTeacher;
  },

  async delete(id: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new AppError('Teacher not found', 404);
    }

    await prisma.teacher.delete({
      where: { id },
    });

    return { message: 'Teacher deleted successfully' };
  },
};

