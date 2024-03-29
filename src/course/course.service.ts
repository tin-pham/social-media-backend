import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { CourseEntity } from './course.entity';
import { CourseRepository } from './course.repository';
import { SectionRepository } from '../section/section.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { DatabaseService } from '../database/database.service';
import { CourseGetListDTO, CourseStoreDTO, CourseUpdateDTO } from './dto/course.dto';
import { CourseDeleteRO, CourseGetDetailRO, CourseGetListRO, CourseStoreRO, CourseUpdateRO } from './ro/course.ro';

@Injectable()
export class CourseService extends BaseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly courseRepository: CourseRepository,
    private readonly sectionRepository: SectionRepository,
    private readonly database: DatabaseService,
  ) {
    super(elasticLogger);
  }

  async store(dto: CourseStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new CourseStoreRO();

    try {
      const courseData = new CourseEntity();
      courseData.name = dto.name;
      courseData.description = dto.description;
      courseData.imageUrl = dto.imageUrl;
      courseData.createdBy = actorId;

      const course = await this.courseRepository.insert(courseData);

      response.id = course.id;
      response.name = course.name;
      response.description = course.description;
      response.imageUrl = course.imageUrl;
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: CourseStoreRO,
      response,
      message: 'Store course successfully',
      actorId,
    });
  }

  async getList(dto: CourseGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = await this.courseRepository.find(dto);

      return this.success({
        classRO: CourseGetListRO,
        response,
        message: 'Get list course successfully',
        actorId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let course: CourseEntity;
    try {
      course = await this.courseRepository.findOneById(id);
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!course) {
      const { code, status, message } = EXCEPTION.COURSE.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    const response = new CourseGetDetailRO();
    response.id = course.id;
    response.name = course.name;
    response.description = course.description;
    response.imageUrl = course.imageUrl;
    return this.success({
      classRO: CourseGetDetailRO,
      response,
      message: 'Get course detail successfully',
      actorId,
    });
  }

  async update(id: number, dto: CourseUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new CourseUpdateRO();

    try {
      const courseData = new CourseEntity();
      courseData.updatedBy = actorId;
      courseData.updatedAt = new Date();
      if (dto.name) {
        courseData.name = dto.name;
      }

      if (dto.description) {
        courseData.description = dto.description;
      }

      if (dto.imageUrl) {
        courseData.imageUrl = dto.imageUrl;
      }

      const course = await this.courseRepository.update(id, courseData);

      response.id = course.id;
      response.name = course.name;
      response.imageUrl = course.imageUrl;
      response.description = course.description;
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: CourseUpdateRO,
      response,
      message: 'Update course successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new CourseDeleteRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Delete course
        const course = await this.courseRepository.deleteWithTransaction(transaction, id, actorId);

        // Delete section
        await this.sectionRepository.deleteMultipleByCourseIdWithTransaction(transaction, id, actorId);

        // Set response
        response.id = course.id;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: CourseDeleteRO,
      response,
      message: 'Delete course successfully',
      actorId,
    });
  }

  private async validateStore(dto: CourseStoreDTO, actorId: number) {
    // Check name exist
    const nameCount = await this.courseRepository.countByName(dto.name);
    if (nameCount) {
      const { code, status, message } = EXCEPTION.COURSE.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, dto: CourseUpdateDTO, actorId: number) {
    // Check exist
    const courseCount = await this.courseRepository.countById(id);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check name exist except id
    const nameCount = await this.courseRepository.countByNameExceptId(dto.name, id);
    if (nameCount) {
      const { code, status, message } = EXCEPTION.COURSE.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const courseCount = await this.courseRepository.countById(id);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
