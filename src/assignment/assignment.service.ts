import { Injectable, Logger } from '@nestjs/common';
import { sql } from 'kysely';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { NotificationGateway } from '../socket/notification.gateway';
import { AssignmentEntity } from './assignment.entity';
import { CourseAssignmentEntity } from '../course-assignment/course-assignment.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { UserNotificationEntity } from '../user-notification/user-notification.entity';
import { AssignmentRepository } from './assignment.repository';
import { AssignmentExerciseRepository } from '../assignment-exercise/assignment-exercise.repository';
import { StudentRepository } from '../student/student.repository';
import { AssignmentSubmitRepository } from '../assignment-submit/assignment-submit.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { CourseRepository } from '../course/course.repository';
import { CourseAssignmentRepository } from '../course-assignment/course-assignment.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { CourseNotificationRepository } from '../course-notification/course-notification.repository';
import { AssignmentNotificationRepository } from '../assignment-notification/assignment-notification.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { AssignmentGetListDTO, AssignmentGetMyListDTO, AssignmentStoreDTO, AssignmentUpdateDTO } from './dto/assignment.dto';
import {
  AssignmentDeleteRO,
  AssignmentGetDetailRO,
  AssignmentGetListRO,
  AssignmentGetSubmissionRO,
  AssignmentStoreRO,
  AssignmentUpdateRO,
} from './ro/assignment.ro';

@Injectable()
export class AssignmentService extends BaseService {
  private readonly logger = new Logger(AssignmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly notificationGateway: NotificationGateway,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentExerciseRepository: AssignmentExerciseRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly studentRepository: StudentRepository,
    private readonly assignmentSubmitRepository: AssignmentSubmitRepository,
    private readonly courseRepository: CourseRepository,
    private readonly courseAssignmentRepository: CourseAssignmentRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly courseStudentRepository: CourseStudentRepository,
    private readonly userNotificationRepository: UserNotificationRepository,
    private readonly courseNotificationRepository: CourseNotificationRepository,
    private readonly assignmentNotificationRepository: AssignmentNotificationRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: AssignmentStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { lesson } = await this.validateStore(dto, actorId);

    let response: AssignmentStoreRO;
    try {
      await this.database.transaction().execute(async (transaction) => {
        await transaction.executeQuery(sql`SET CONSTRAINTS ALL DEFERRED;`.compile(transaction));
        const assignmentData = new AssignmentEntity();

        assignmentData.createdBy = actorId;
        assignmentData.updatedBy = actorId;
        assignmentData.name = dto.name;
        assignmentData.description = dto.description;
        assignmentData.dueDate = dto.dueDate;

        if (dto.lessonId) {
          assignmentData.lessonId = dto.lessonId;
        }

        const assignment = await this.assignmentRepository.insertWithTransaction(transaction, assignmentData);

        if (dto.courseId) {
          const data = new CourseAssignmentEntity({ courseId: dto.courseId, assignmentId: assignment.id });
          await this.courseAssignmentRepository.storeWithTransaction(transaction, data);
        }

        if (dto.exerciseIds) {
          await this.assignmentExerciseRepository.insertMultipleByExerciseIdsWithTransaction(transaction, {
            exerciseIds: dto.exerciseIds,
            assignmentId: assignment.id,
            actorId: actorId,
          });
        }

        // Store notification
        const notificationData = new NotificationEntity({
          title: 'Assignment cho bạn',
          content: `${lesson.courseName} đã tạo assignment mới: ${assignment.name}`,
        });
        const notification = await this.notificationRepository.insertWithTransaction(transaction, notificationData);

        // Notify to who inside the course
        await this.courseNotificationRepository.insertWithTransaction(transaction, {
          courseId: lesson.courseId,
          notificationId: notification.id,
        });

        // Keep assignment id for direction
        await this.assignmentNotificationRepository.insertWithTransaction(transaction, {
          assignmentId: assignment.id,
          notificationId: notification.id,
        });

        // Keep is read for each user
        const courseStudents = await this.courseStudentRepository.getStudentIdsByCourseId(lesson.courseId || dto.courseId);

        let users: { id: number }[] = [];
        if (courseStudents.length) {
          const studentIds = courseStudents.map((courseStudent) => courseStudent.studentId);
          users = await this.studentRepository.getUserIdsByStudentIds(studentIds);

          const userNotificationData = users.map(
            (user) =>
              new UserNotificationEntity({
                userId: user.id,
                notificationId: notification.id,
              }),
          );
          await this.userNotificationRepository.insertMultipleWithTransaction(transaction, userNotificationData);
        }

        // Send notification
        this.notificationGateway.sendNotification();

        response = new AssignmentStoreRO({
          id: assignment.id,
          name: assignment.name,
          dueDate: assignment.dueDate,
        });
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AssignmentStoreRO,
      response,
      message: 'Assignment stored successfully',
      actorId,
    });
  }

  async getList(dto: AssignmentGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.assignmentRepository.find(dto, actorId);

      return this.success({
        classRO: AssignmentGetListRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    let assignment: AssignmentGetDetailRO;

    try {
      assignment = await this.assignmentRepository.findOneById(id, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!assignment) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AssignmentGetDetailRO,
      response: assignment,
    });
  }

  async update(id: number, dto: AssignmentUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    let response: AssignmentUpdateRO;

    try {
      const assignmentData = new AssignmentEntity();
      assignmentData.updatedAt = new Date();
      assignmentData.updatedBy = actorId;
      if (dto.name) assignmentData.name = dto.name;
      if (dto.description) assignmentData.description = dto.description;
      if (dto.dueDate) assignmentData.dueDate = dto.dueDate;

      const assignment = await this.assignmentRepository.update(id, assignmentData);

      response = new AssignmentUpdateRO({
        id: assignment.id,
        name: assignment.name,
        dueDate: assignment.dueDate,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AssignmentUpdateRO,
      response,
      message: 'Assignment updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    let response: AssignmentDeleteRO;

    try {
      const assignment = await this.assignmentRepository.delete(id, actorId);

      response = new AssignmentDeleteRO({
        id: assignment.id,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AssignmentDeleteRO,
      response,
      message: 'Assignment deleted successfully',
      actorId,
    });
  }

  async getSubmission(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { student } = await this.validateGetSubmission(id, actorId);

    try {
      const submission = await this.assignmentSubmitRepository.findOneByAssignmentIdAndStudentId(id, student.id);

      return this.success({
        classRO: AssignmentGetSubmissionRO,
        response: submission,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.GET_SUBMISSION_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async getMyList(dto: AssignmentGetMyListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { student } = await this.validateGetMyList(actorId);

    try {
      const response = await this.assignmentRepository.findByStudentId(student.id, dto);

      return response;
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.GET_MY_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateStore(dto: AssignmentStoreDTO, actorId: number) {
    // Check lesson exist
    let lesson: any;
    if (dto.lessonId) {
      lesson = await this.lessonRepository.getCourseNameById(dto.lessonId);
      if (!lesson) {
        const { code, status, message } = EXCEPTION.LESSON.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }

      // Check name exist same lesson
      const nameCount = await this.assignmentRepository.countByNameAndLessonId(dto.name, dto.lessonId);
      if (nameCount) {
        const { code, status, message } = EXCEPTION.ASSIGNMENT.ALREADY_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    // Check course exist
    if (dto.courseId) {
      const courseCount = await this.courseRepository.countById(dto.courseId);
      if (!courseCount) {
        const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    return { lesson };
  }

  private async validateUpdate(id: number, dto: AssignmentUpdateDTO, actorId: number) {
    // Check exist
    const assignment = await this.assignmentRepository.findOneById(id, actorId);
    if (!assignment) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    if (dto.name) {
      // Check name exist except id
      const nameCount = await this.assignmentRepository.countByNameAndLessonIdExceptId(dto.name, assignment.lessonId, id);
      if (nameCount) {
        const { code, status, message } = EXCEPTION.ASSIGNMENT.ALREADY_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const assignmentCount = await this.assignmentRepository.countById(id);
    if (!assignmentCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateGetSubmission(id: number, actorId: number) {
    // Check exist
    const assignmentCount = await this.assignmentRepository.countById(id);
    if (!assignmentCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check student exist
    const student = await this.studentRepository.findOneByUserId(actorId);
    if (!student) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    return { student };
  }

  private async validateGetMyList(actorId: number) {
    // Check student exist
    const student = await this.studentRepository.findOneByUserId(actorId);
    if (!student) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    return { student };
  }
}
