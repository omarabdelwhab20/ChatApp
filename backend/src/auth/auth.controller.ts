import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-up.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignInDto) {
    return this.authService.signUp(signUpDto);
  }


  @Post('sign-in')
  signIn(@Body() signInDto : SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token : string) {
    return this.authService.verifyEmail(token);
  }


  @Post('reset-password')
  ResetPassowrd(@Body() email : string){
    return this.authService.resetPassword(email)
  }

  @Post('verify-code')
  verifyCode(@Body() resetPasswordDto : ResetPasswordDto){
    return this.authService.verifyCode(resetPasswordDto)
  }

  @Post()
  changePassword(@Body() changePasswordDto : ChangePasswordDto){
    return this.authService.changePassword(changePasswordDto);
  }

  
}
