import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { ROLE } from '../role/enum/role.enum';
import { TeacherEntity } from './teacher.entity';
import { TeacherRepository } from './teacher.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserService } from '../user/user.service';
import { S3Service } from '../s3/s3.service';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { TeacherGetListDTO, TeacherStoreDTO, TeacherUpdateDTO } from './dto/teacher.dto';
import { TeacherDeleteRO, TeacherGetDetailRO, TeacherGetListRO, TeacherStoreRO, TeacherUpdateRO } from './ro/teacher.ro';

@Injectable()
export class TeacherService extends UserService {
  private readonly logger = new Logger(TeacherService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    userRepository: UserRepository,
    roleRepository: RoleRepository,
    userRoleRepository: UserRoleRepository,
    database: DatabaseService,
    s3Service: S3Service,
    private readonly teacherRepository: TeacherRepository,
  ) {
    super(elasticLogger, userRepository, roleRepository, userRoleRepository, database, s3Service);
  }

  async store(dto: TeacherStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await super.validateStore(dto, actorId);
    const response = new TeacherStoreRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store user
        const user = await super.storeWithTransaction(transaction, dto, decoded);

        // Get teacher role id
        const { id: roleId } = await this.roleRepository.getIdByName(ROLE.TEACHER);

        // Store user role
        await super.storeUserRoleWithTransaction(transaction, user.id, roleId);

        // Store teacher
        const teacherData = new TeacherEntity();
        teacherData.userId = user.id;
        const { id } = await this.teacherRepository.insertWithTransaction(transaction, teacherData);

        // Set response
        response.id = id;
        response.username = user.username;
        response.email = user.email;
        response.phone = user.phone;
        response.displayName = user.displayName;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.TEACHER.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: TeacherStoreRO,
      response,
      message: 'Teacher stored successfully',
      actorId,
    });
  }

  async getList(dto: TeacherGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const teachers = await this.teacherRepository.find(dto);
      return this.success({ classRO: TeacherGetListRO, response: teachers });
    } catch (error) {
      const { code, status, message } = EXCEPTION.TEACHER.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }
  }

  async getDetail(id: string, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const response = new TeacherGetDetailRO();
    try {
      const teacher = await this.teacherRepository.findUserById(id);

      if (!teacher) {
        const { code, status, message } = EXCEPTION.TEACHER.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }

      response.id = id;
      response.username = teacher.username;
      response.email = teacher.email;
      response.phone = teacher.phone;
      response.displayName = teacher.displayName;
    } catch (error) {
      const { code, status, message } = EXCEPTION.TEACHER.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({ classRO: TeacherGetDetailRO, response });
  }

  async update(id: string, dto: TeacherUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);
    const response = new TeacherUpdateRO();

    try {
      const { userId } = await this.teacherRepository.getUserIdByTeacherId(id);
      await this.database.transaction().execute(async (transaction) => {
        // Update user
        const user = await super.updateWithTransaction(transaction, userId, dto, decoded.userId);

        // Set response
        const { id: teacherId } = await this.teacherRepository.getIdByUserId(user.id);
        if (!teacherId) {
          throw new InternalServerErrorException();
        }
        response.id = teacherId;
        response.username = user.username;
        response.email = user.email;
        response.phone = user.phone;
        response.displayName = user.displayName;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.TEACHER.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: TeacherUpdateRO,
      response,
      message: 'Teacher updated successfully',
      actorId,
    });
  }

  async delete(id: string, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    try {
      const { userId } = await this.teacherRepository.getUserIdByTeacherId(id);
      await this.database.transaction().execute(async (transaction) => {
        // Delete user
        await super.deleteWithTransaction(transaction, userId, decoded.userId);
        // Delete user role
        await super.deleteUserRoleWithTransaction(transaction, userId, actorId);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.TEACHER.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({ classRO: TeacherDeleteRO, response: { id } });
  }

  private async validateUpdate(id: string, dto: TeacherUpdateDTO, actorId: number) {
    // Check id exists
    const teacher = await this.teacherRepository.findOneById(id);
    if (!teacher) {
      const { code, status, message } = EXCEPTION.TEACHER.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check email unique
    if (dto.email) {
      const emailCount = await this.userRepository.countByEmailExceptId(dto.email, teacher.userId);
      if (emailCount) {
        const { code, status, message } = EXCEPTION.USER.EMAIL_ALREADY_EXISTS;
        this.throwException({ code, status, message, actorId });
      }
    }

    // Check phone unique
    if (dto.phone) {
      const phoneCount = await this.userRepository.countByPhoneExceptId(dto.phone, teacher.userId);
      if (phoneCount) {
        const { code, status, message } = EXCEPTION.USER.PHONE_ALREADY_EXISTS;
        this.throwException({ code, status, message, actorId });
      }
    }
  }

  private async validateDelete(id: string, actorId: number) {
    // Check id exists
    const teacherCount = await this.teacherRepository.countById(id);
    if (!teacherCount) {
      const { code, status, message } = EXCEPTION.TEACHER.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
