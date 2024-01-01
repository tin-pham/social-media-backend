import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { DatabaseModule, databaseConfig } from './database';
import { AuthModule } from './auth';
import { HealthModule } from './health/health.module';
import { ThrottlerModule } from './throttler/throttler.module';
import { LogsMiddleware } from './logger/logs.middleware';
import { appProviders } from './app.provider';
import { RoleModule } from './role/role.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ParentModule } from './parent/parent.module';
import { SubjectModule } from './subject/subject.module';
import { GroupModule } from './group/group.module';
import { ElasticsearchLoggerModule } from './elastic-search-logger/elastic-search-logger.module';
import { SubjectGroupModule } from './subject-group/subject-group.module';
import { StudentParentModule } from './student-parent/student-parent.module';
import { GradeModule } from './grade/grade.module';
import { ClassroomModule } from './classroom/classroom.module';
import { YearModule } from './year/year.module';
import { LevelModule } from './level/level.module';
import { ClassroomYearStudentModule } from './classroom-year-student/classroom-year-student.module';
import { TeacherSubjectModule } from './teacher-subject/teacher-subject.module';
import { ClassroomYearAssignmentModule } from './classroom-year-assignment/classroom-year-assignment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(databaseConfig),
    ElasticsearchLoggerModule,
    AuthModule,
    HealthModule,
    ThrottlerModule,
    RoleModule,
    StudentModule,
    TeacherModule,
    ParentModule,
    StudentParentModule,
    SubjectModule,
    GroupModule,
    SubjectGroupModule,
    GradeModule,
    ClassroomModule,
    YearModule,
    LevelModule,
    ClassroomYearStudentModule,
    TeacherSubjectModule,
    ClassroomYearAssignmentModule,
  ],
  providers: [...appProviders],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
