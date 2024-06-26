import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { durationParser } from '../common/function/youtube-video-duration-parser';
import { BaseService } from '../base';
import { ROLE } from '../role/enum/role.enum';
import { DatabaseService } from '../database';
import { getVideoId } from '../common/function/get-youtube-video-id';
import { EXCEPTION, IJwtPayload } from '../common';
import { LessonEntity } from './lesson.entity';
import { VideoEntity } from '../video/video.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { UserNotificationEntity } from '../user-notification/user-notification.entity';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LessonRepository } from './lesson.repository';
import { SectionRepository } from '../section/section.repository';
import { StudentRepository } from '../student/student.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { VideoRepository } from '../video/video.repository';
import { CourseNotificationRepository } from '../course-notification/course-notification.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { LessonNotificationRepository } from '../lesson-notification/lesson-notification.repository';
import { LessonGetListDTO, LessonStoreDTO, LessonUpdateDTO } from './dto/lesson.dto';
import { LessonDeleteRO, LessonGetDetailRO, LessonGetListRO, LessonStoreRO, LessonUpdateRO } from './ro/lesson.ro';
import { NotificationGateway } from '../socket/notification.gateway';
import { isValidYoutubeId } from '../common/function/is-valid-youtube-id';

@Injectable()
export class LessonService extends BaseService {
  private readonly logger = new Logger(LessonService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly http: HttpService,
    private readonly database: DatabaseService,
    private readonly notificationGateway: NotificationGateway,
    private readonly configService: ConfigService,
    private readonly lessonRepository: LessonRepository,
    private readonly sectionRepository: SectionRepository,
    private readonly studentRepository: StudentRepository,
    private readonly courseStudentRepository: CourseStudentRepository,
    private readonly videoRepository: VideoRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly courseNotificationRepository: CourseNotificationRepository,
    private readonly userNotificationRepository: UserNotificationRepository,
    private readonly lessonNotificationRepository: LessonNotificationRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: LessonStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { section } = await this.validateStore(dto, actorId);
    const response = new LessonStoreRO();

    try {
      const lessonData = new LessonEntity({
        title: dto.title,
        body: dto.body,
        sectionId: dto.sectionId,
        createdBy: actorId,
      });

      let videoData: VideoEntity;
      if (dto.videoUrl) {
        videoData = new VideoEntity();
        videoData.url = dto.videoUrl;

        const YOUTUBE_API_KEY = this.configService.get('YOUTUBE_API_KEY');
        const videoId = getVideoId(dto.videoUrl);
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=contentDetails`;

        const response = await firstValueFrom(this.http.get(url));
        videoData.duration = durationParser(response.data.items[0].contentDetails.duration);
      }

      await this.database.transaction().execute(async (transaction) => {
        // Store video
        let video: VideoEntity;
        if (videoData) {
          video = await this.videoRepository.insertWithTransaction(transaction, videoData);
        }

        // Store lesson
        lessonData.videoId = video?.id;
        const lesson = await this.lessonRepository.insertWithTransaction(transaction, lessonData);

        // Store notification
        const notificationData = new NotificationEntity({
          title: 'BÀI HỌC MỚI',
          content: `Khóa học ${section.courseName} vừa tạo bài học mới: ${lesson.title}`,
        });
        const notification = await this.notificationRepository.insertWithTransaction(transaction, notificationData);

        // Notify for who inside the course
        await this.courseNotificationRepository.insertWithTransaction(transaction, {
          courseId: section.courseId,
          notificationId: notification.id,
        });

        // Keep lesson id for direction
        await this.lessonNotificationRepository.insertWithTransaction(transaction, {
          lessonId: lesson.id,
          notificationId: notification.id,
        });

        // Keep is read for each user
        const courseStudents = await this.courseStudentRepository.getStudentIdsByCourseId(section.courseId);

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

        this.notificationGateway.sendNotification();

        response.title = lesson.title;
        response.sectionId = lesson.sectionId;
        response.videoUrl = video?.url;
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonStoreRO,
      response,
      message: 'Lesson has been stored successfully',
      actorId,
    });
  }

  async getList(dto: LessonGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = await this.lessonRepository.find(dto);

      return this.success({
        classRO: LessonGetListRO,
        response,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const { roles, userId: actorId } = decoded;

    let response: any;

    try {
      response = await this.lessonRepository.findOneById(id);
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    if (!response) {
      const { status, message, code } = EXCEPTION.LESSON.NOT_FOUND;
      this.throwException({ status, message, code, actorId });
    }

    // Is student register to this course
    if (roles.includes(ROLE.STUDENT)) {
      const lesson = await this.lessonRepository.getCourseIdById(id);
      const student = await this.studentRepository.getStudentIdByUserId(actorId);
      const courseStudent = await this.courseStudentRepository.countByCourseIdAndStudentId(lesson.courseId, student.id);

      if (!courseStudent) {
        const { status, message, code } = EXCEPTION.COURSE_STUDENT.NOT_REGISTERED;
        this.throwException({ status, message, code, actorId });
      }
    }

    return this.success({
      classRO: LessonGetDetailRO,
      response,
    });
  }

  async update(id: number, dto: LessonUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, actorId);

    const response = new LessonUpdateRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        const lessonData = new LessonEntity();
        lessonData.updatedBy = actorId;
        if (dto.title) {
          lessonData.title = dto.title;
        }

        if (dto.body) {
          lessonData.body = dto.body;
        }

        const videoData = new VideoEntity();
        console.log({ dto });
        if (dto.videoUrl) {
          videoData.url = dto.videoUrl;

          // New metadata
          const YOUTUBE_API_KEY = this.configService.get('YOUTUBE_API_KEY');
          const videoId = getVideoId(dto.videoUrl);
          const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=contentDetails`;

          const response = await firstValueFrom(this.http.get(url));
          videoData.duration = durationParser(response.data.items[0].contentDetails.duration);
        }

        let video: any;
        if (videoData?.url) {
          video = await this.videoRepository.getIdByLessonId(id);
          if (video) {
            await this.videoRepository.deleteWithTransaction(transaction, video.id, actorId);
          }
          video = await this.videoRepository.insertWithTransaction(transaction, videoData);
        }

        lessonData.videoId = video?.id;
        const lesson = await this.lessonRepository.updateWithTransaction(transaction, id, lessonData);

        response.id = lesson.id;
        response.title = lesson.title;
        response.videoUrl = video?.url;
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonUpdateRO,
      response,
      message: 'Lesson has been updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new LessonDeleteRO();

    try {
      const lesson = await this.lessonRepository.delete(id, actorId);
      response.id = lesson.id;
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonDeleteRO,
      response,
      message: 'Lesson has been deleted successfully',
      actorId,
    });
  }

  private async validateStore(dto: LessonStoreDTO, actorId: number) {
    // Check section exist
    const section = await this.sectionRepository.getCourseNameById(dto.sectionId);
    if (!section) {
      const { status, message, code } = EXCEPTION.SECTION.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    if (dto.videoUrl) {
      const YOUTUBE_API_KEY = this.configService.get('YOUTUBE_API_KEY');
      const videoId = getVideoId(dto.videoUrl);

      if (!isValidYoutubeId(videoId)) {
        const { status, message, code } = EXCEPTION.LESSON.INVALID_VIDEO_URL;
        this.throwException({ status, message, code, actorId });
      }

      const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=contentDetails`;

      const response = await firstValueFrom(this.http.get(url));
      console.log({ response });
    }
    return { section };
  }

  private async validateUpdate(id: number, actorId: number) {
    // Check exist
    const lessonCount = await this.lessonRepository.countById(id);
    if (!lessonCount) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const lessonCount = await this.lessonRepository.countById(id);
    if (!lessonCount) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
