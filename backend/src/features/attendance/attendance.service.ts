import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { AttendanceStatus } from '@prisma/client';

export interface CreateAttendanceDto {
  studentId: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface UpdateAttendanceDto {
  status?: AttendanceStatus;
  remarks?: string;
}

export interface ListAttendanceQuery {
  page?: number;
  limit?: number;
  studentId?: string;
  classId?: string;
  subjectId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

export const attendanceService = {
  async create(data: CreateAttendanceDto) {
    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    // Verify teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: data.teacherId },
    });

    if (!teacher) {
      throw new AppError('Teacher not found', 404);
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

    // Check if attendance already exists for this date
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        studentId_classId_subjectId_date: {
          studentId: data.studentId,
          classId: data.classId,
          subjectId: data.subjectId,
          date: new Date(data.date),
        },
      },
    });

    if (existingAttendance) {
      throw new AppError('Attendance already marked for this date', 409);
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId: data.studentId,
        teacherId: data.teacherId,
        classId: data.classId,
        subjectId: data.subjectId,
        date: new Date(data.date),
        status: data.status,
        remarks: data.remarks,
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
        class: true,
        subject: true,
      },
    });

    return attendance;
  },

  async findById(id: string) {
    const attendance = await prisma.attendance.findUnique({
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
        class: true,
        subject: true,
      },
    });

    if (!attendance) {
      throw new AppError('Attendance record not found', 404);
    }

    return attendance;
  },

  async list(query: ListAttendanceQuery) {
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

    if (query.date) {
      where.date = new Date(query.date);
    } else if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) {
        where.date.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.date.lte = new Date(query.endDate);
      }
    }

    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
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
          class: true,
          subject: true,
        },
        orderBy: { date: 'desc' },
      }),
      prisma.attendance.count({ where }),
    ]);

    return {
      data: attendance,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getStudentAttendance(studentId: string, query: any) {
    const where: any = {
      studentId,
    };

    if (query.classId) {
      where.classId = query.classId;
    }

    if (query.subjectId) {
      where.subjectId = query.subjectId;
    }

    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) {
        where.date.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.date.lte = new Date(query.endDate);
      }
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        class: true,
        subject: true,
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
      orderBy: { date: 'desc' },
    });

    // Calculate statistics
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === 'PRESENT').length;
    const absent = attendance.filter((a) => a.status === 'ABSENT').length;
    const late = attendance.filter((a) => a.status === 'LATE').length;
    const excused = attendance.filter((a) => a.status === 'EXCUSED').length;

    return {
      data: attendance,
      statistics: {
        total,
        present,
        absent,
        late,
        excused,
        attendanceRate: total > 0 ? ((present + late + excused) / total) * 100 : 0,
      },
    };
  },

  async update(id: string, data: UpdateAttendanceDto) {
    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new AppError('Attendance record not found', 404);
    }

    const updateData: any = {};

    if (data.status) updateData.status = data.status;
    if (data.remarks !== undefined) updateData.remarks = data.remarks;

    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: updateData,
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
        class: true,
        subject: true,
      },
    });

    return updatedAttendance;
  },

  async getReports(query: any) {
    const where: any = {};

    if (query.classId) {
      where.classId = query.classId;
    }

    if (query.subjectId) {
      where.subjectId = query.subjectId;
    }

    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) {
        where.date.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.date.lte = new Date(query.endDate);
      }
    }

    const attendance = await prisma.attendance.findMany({
      where,
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

    // Group by student
    const studentStats: Record<string, any> = {};

    attendance.forEach((record) => {
      const studentId = record.studentId;
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          student: record.student,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
        };
      }

      studentStats[studentId].total++;
      studentStats[studentId][record.status.toLowerCase()]++;
    });

    // Calculate attendance rates
    const reports = Object.values(studentStats).map((stats: any) => ({
      ...stats,
      attendanceRate:
        stats.total > 0 ? ((stats.present + stats.late + stats.excused) / stats.total) * 100 : 0,
    }));

    return {
      data: reports,
      summary: {
        totalStudents: reports.length,
        averageAttendanceRate:
          reports.length > 0
            ? reports.reduce((sum: number, r: any) => sum + r.attendanceRate, 0) / reports.length
            : 0,
      },
    };
  },
};

