import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API, HttpExceptionRO, IJwtPayload } from '../common';
import { JwtPayload } from '../common/decorator';
import { Roles } from '../auth/role/role.decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { StudentExerciseService } from './student-exercise.service';
import {
  StudentExerciseBulkDeleteDTO,
  StudentExerciseGetListSubmittedDTO,
  StudentExerciseStoreDTO,
  StudentExerciseSubmitDTO,
} from './dto/student-exercise.dto';
import { ResultRO } from '../common/ro/result.ro';
import { StudentExerciseStoreRO } from './ro/student-exercise.ro';

const { TAGS, CONTROLLER, STORE, SUBMIT, GET_SUBMITTED_LIST, DELETE, BULK_DELETE } = API.STUDENT_EXERCISE;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class StudentExerciseController {
  constructor(private readonly studentExerciseService: StudentExerciseService) {}

  @ApiOperation({ summary: STORE.OPERATION })
  @ApiCreatedResponse({ type: StudentExerciseStoreRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(STORE.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  store(@Body() dto: StudentExerciseStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.studentExerciseService.store(dto, decoded);
  }

  @ApiOperation({ summary: SUBMIT.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Patch(SUBMIT.ROUTE)
  @Roles(ROLE.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  submit(@Param('id', ParseIntPipe) id: number, @Body() dto: StudentExerciseSubmitDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.studentExerciseService.submit(id, dto, decoded);
  }

  @ApiOperation({ summary: GET_SUBMITTED_LIST.OPERATION })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Get(GET_SUBMITTED_LIST.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard)
  getSubmittedList(@Query() dto: StudentExerciseGetListSubmittedDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.studentExerciseService.getListSubmitted(dto, decoded);
  }

  @ApiOperation({ summary: DELETE.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(DELETE.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id', ParseIntPipe) id: number, @JwtPayload() decoded: IJwtPayload) {
    return this.studentExerciseService.delete(id, decoded);
  }

  @ApiOperation({ summary: BULK_DELETE.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(BULK_DELETE.ROUTE)
  @Roles(ROLE.TEACHER)
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  bulkDelete(@Body() dto: StudentExerciseBulkDeleteDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.studentExerciseService.bulkDelete(dto, decoded);
  }
}
