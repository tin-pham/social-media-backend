import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
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
import { Roles } from '../auth/role/role.decorator';
import { ROLE } from '../role/enum/role.enum';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { JwtPayload } from '../common/decorator';
import { LessonFileBulkDeleteDTO, LessonFileBulkStoreDTO } from './dto/lesson-file.dto';
import { ResultRO } from '../common/ro/result.ro';
import { LessonFileService } from './lesson-file.service';

const { TAGS, CONTROLLER, BULK_STORE, BULK_DELETE } = API.LESSON_FILE;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class LessonFileController {
  constructor(private readonly lessonFileService: LessonFileService) {}

  @ApiOperation({ summary: BULK_STORE.OPERATION })
  @ApiCreatedResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiConflictResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Post(BULK_STORE.ROUTE)
  @Roles(ROLE.STAFF)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  bulkStore(@Body() dto: LessonFileBulkStoreDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonFileService.bulkStore(dto, decoded);
  }

  @ApiOperation({ summary: BULK_DELETE.OPERATION })
  @ApiOkResponse({ type: ResultRO })
  @ApiBadRequestResponse({ type: HttpExceptionRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiForbiddenResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @Delete(BULK_DELETE.ROUTE)
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  bulkDelete(@Query() dto: LessonFileBulkDeleteDTO, @JwtPayload() decoded: IJwtPayload) {
    return this.lessonFileService.bulkDelete(dto, decoded);
  }
}
