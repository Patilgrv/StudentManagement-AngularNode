import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

export interface CreateSubjectDto {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateSubjectDto {
  name?: string;
  code?: string;
  description?: string;
}

export interface ListSubjectsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export const subjectService = {
  async create(data: CreateSubjectDto) {
    const existingSubject = await prisma.subject.findUnique({
      where: { code: data.code },
    });

    if (existingSubject) {
      throw new AppError('Subject with this code already exists', 409);
    }

    const subject = await prisma.subject.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
      },
    });

    return subject;
  },

  async findById(id: string) {
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    return subject;
  },

  async list(query: ListSubjectsQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              assignments: true,
              enrollments: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.subject.count({ where }),
    ]);

    return {
      data: subjects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(id: string, data: UpdateSubjectDto) {
    const subject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    // Check for unique constraint if updating code
    if (data.code && data.code !== subject.code) {
      const existingSubject = await prisma.subject.findUnique({
        where: { code: data.code },
      });

      if (existingSubject) {
        throw new AppError('Subject with this code already exists', 409);
      }
    }

    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.code) updateData.code = data.code;
    if (data.description !== undefined) updateData.description = data.description;

    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: updateData,
    });

    return updatedSubject;
  },

  async delete(id: string) {
    const subject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    await prisma.subject.delete({
      where: { id },
    });

    return { message: 'Subject deleted successfully' };
  },

  async assignTeacher(subjectId: string, teacherId: string) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new AppError('Teacher not found', 404);
    }

    const existingAssignment = await prisma.subjectAssignment.findUnique({
      where: {
        teacherId_subjectId: {
          teacherId,
          subjectId,
        },
      },
    });

    if (existingAssignment) {
      throw new AppError('Teacher is already assigned to this subject', 409);
    }

    const assignment = await prisma.subjectAssignment.create({
      data: {
        teacherId,
        subjectId,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        subject: true,
      },
    });

    return assignment;
  },

  async unassignTeacher(subjectId: string, teacherId: string) {
    const assignment = await prisma.subjectAssignment.findUnique({
      where: {
        teacherId_subjectId: {
          teacherId,
          subjectId,
        },
      },
    });

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    await prisma.subjectAssignment.delete({
      where: {
        teacherId_subjectId: {
          teacherId,
          subjectId,
        },
      },
    });

    return { message: 'Teacher unassigned successfully' };
  },
};

