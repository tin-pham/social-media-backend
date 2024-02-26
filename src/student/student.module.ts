import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { S3Service } from '../s3/s3.service';
import { StudentRepository } from './student.repository';
import { UserRepository } from '../user/user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { RoleRepository } from '../role/role.repository';

@Module({
  controllers: [StudentController],
  providers: [StudentService, StudentRepository, UserRepository, UserRoleRepository, RoleRepository, S3Service],
})
export class StudentModule {}
