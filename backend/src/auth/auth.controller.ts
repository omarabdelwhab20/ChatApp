import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('verify-email/:token')
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('reset-password')
  ResetPassowrd(@Body() email: string) {
    return this.authService.resetPassword(email);
  }

  @Post('verify-code')
  verifyCode(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.verifyCode(resetPasswordDto);
  }

  @Post()
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Get('find-user/:userId')
  async findUser(@Param('userId') userId: string) {
    const user = await this.authService.findUser(userId);
    return {
      status: 'success',
      data: user,
    };
  }

  @Get('find-all')
  findAllUsers() {
    return this.authService.findAllUsers();
  }
}
