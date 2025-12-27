import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

export interface CreateClassDto {
  name: string;
  grade: number;
  section?: string;
  academicYear: string;
}

export interface UpdateClassDto {
  name?: string;
  grade?: number;
  section?: string;
  academicYear?: string;
}

export interface ListClassesQuery {
  page?: number;
  limit?: number;
  grade?: number;
  academicYear?: string;
}

export const classService = {
  async create(data: CreateClassDto) {
    const existingClass = await prisma.class.findUnique({
      where: {
        name_grade_section_academicYear: {
          name: data.name,
          grade: data.grade,
          section: data.section || null,
          academicYear: data.academicYear,
        },
      },
    });

    if (existingClass) {
      throw new AppError('Class with these details already exists', 409);
    }

    const classRecord = await prisma.class.create({
      data: {
        name: data.name,
        grade: data.grade,
        section: data.section,
        academicYear: data.academicYear,
      },
    });

    return classRecord;
  },

  async findById(id: string) {
    const classRecord = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!classRecord) {
      throw new AppError('Class not found', 404);
    }

    return classRecord;
  },

  async list(query: ListClassesQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.grade) {
      where.grade = query.grade;
    }

    if (query.academicYear) {
      where.academicYear = query.academicYear;
    }

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
        orderBy: [{ grade: 'asc' }, { name: 'asc' }],
      }),
      prisma.class.count({ where }),
    ]);

    return {
      data: classes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(id: string, data: UpdateClassDto) {
    const classRecord = await prisma.class.findUnique({
      where: { id },
    });

    if (!classRecord) {
      throw new AppError('Class not found', 404);
    }

    // Check for unique constraint if updating name, grade, section, or academicYear
    if (data.name || data.grade || data.section !== undefined || data.academicYear) {
      const name = data.name || classRecord.name;
      const grade = data.grade || classRecord.grade;
      const section = data.section !== undefined ? data.section : classRecord.section;
      const academicYear = data.academicYear || classRecord.academicYear;

      const existingClass = await prisma.class.findUnique({
        where: {
          name_grade_section_academicYear: {
            name,
            grade,
            section: section || null,
            academicYear,
          },
        },
      });

      if (existingClass && existingClass.id !== id) {
        throw new AppError('Class with these details already exists', 409);
      }
    }

    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.grade) updateData.grade = data.grade;
    if (data.section !== undefined) updateData.section = data.section;
    if (data.academicYear) updateData.academicYear = data.academicYear;

    const updatedClass = await prisma.class.update({
      where: { id },
      data: updateData,
    });

    return updatedClass;
  },

  async delete(id: string) {
    const classRecord = await prisma.class.findUnique({
      where: { id },
    });

    if (!classRecord) {
      throw new AppError('Class not found', 404);
    }

    await prisma.class.delete({
      where: { id },
    });

    return { message: 'Class deleted successfully' };
  },
};

