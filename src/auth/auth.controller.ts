import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { API, HttpExceptionRO, IRequestWithUser } from '../common';
import { LocalGuard } from './local/local.guard';
import { JwtRefreshTokenGuard } from './jwt/jwt-refresh-token.guard';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/auth.dto';
import { SignInRO } from './ro/auth.ro';

const { TAGS, CONTROLLER, SIGNIN, REFRESH_TOKEN } = API.AUTH;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: SIGNIN.OPERATION })
  @ApiBody({ type: SignInDTO })
  @UseGuards(LocalGuard)
  @ApiOkResponse({ type: SignInRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @HttpCode(HttpStatus.OK)
  @Post(SIGNIN.ROUTE)
  async signIn(@Req() req: IRequestWithUser) {
    return this.authService.signIn(req.user);
  }

  @ApiOperation({ summary: REFRESH_TOKEN.OPERATION })
  @ApiOkResponse({ type: SignInRO })
  @ApiUnauthorizedResponse({ type: HttpExceptionRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post(REFRESH_TOKEN.ROUTE)
  async refreshToken(@Req() req: IRequestWithUser) {
    return this.authService.refreshAccessTokenByUser(req.user);
  }
}
