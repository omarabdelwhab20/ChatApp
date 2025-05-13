import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { SignUpDto } from './dto/sign-up.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

    private readonly mailerService: MailerService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;

    const isFound = await this.userRepository.findOneBy({ email });

    if (isFound) {
      throw new HttpException('Email is already used', HttpStatus.BAD_REQUEST);
    }

    const isHashed = await bcrypt.hash(password, 10);

    const verificationLink = crypto.randomBytes(32).toString('hex');
    const verificationLinkExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await this.userRepository.create({
      ...signUpDto,
      verificationLink: verificationLink,
      verificationLinkExpires: verificationLinkExpires,
      password: isHashed,
    });

    await this.userRepository.save(newUser);

    this.sendVerificationLink(email, verificationLink);

    return {
      status: HttpStatus.CREATED,
      message: 'Verification link sent to your email',
    };
  }

  async sendVerificationLink(email: string, token: string) {
    const verificationLink = `http://localhost:5173/verify-email/${token}`;

    const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Streamify!</h2>
        <p>Please verify your email by clicking the button below:</p>
        <a 
          href="${verificationLink}" 
          style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;"
        >
          Verify Email
        </a>
        <p style="margin-top: 20px; color: #666;">
          This link will expire in 24 hours. If you didn't request this, please ignore this email.
        </p>
      </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      html: htmlMessage,
    });
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOneBy({
      verificationLink: token,
    });

    if (!user) {
      throw new HttpException(
        'Invalid token - not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.isVerified) {
      throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
    }

    if (user.verificationLinkExpires < new Date()) {
      throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
    }

    // Create transaction to ensure atomic operation
    await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        user.isVerified = true;
        user.verificationLink = null;
        user.verificationLinkExpires = null;

        await transactionalEntityManager.save(user);
      },
    );

    return {
      status: HttpStatus.OK,
      message: 'Email verified successfully',
    };
  }

  async signIn(signInDto: SignInDto) {
    const { password, email } = signInDto;

    const isFound = await this.userRepository.findOneBy({ email });
    if (!isFound) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const ifMatched = await bcrypt.compare(password, isFound.password);
    if (!ifMatched) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!isFound.isVerified) {
      throw new HttpException('Email not verified', HttpStatus.BAD_REQUEST);
    }

    const token = await this.jwtService.signAsync(
    {
      sub: isFound.id, // Standard JWT subject claim
      email: isFound.email,
      fullName: isFound.fullName
    },
    {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d' // Explicit expiration
    }
  );

    return {
      status: HttpStatus.OK,
      message: 'Login successfully',
      token,
      user : {
        id : isFound.id,
        email : isFound.email,
        fullName : isFound.fullName
      }
    };
  }

  async resetPassword(email: string) {
    const isFound = await this.userRepository.findOneBy({ email });

    if (!isFound) {
      return {
        status: HttpStatus.OK,
        message:
          'IF this email is registered check the inbox to reset your password',
      };
    }

    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    isFound.resetPasswordCode = code;
    isFound.resetPasswordCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepository.save(isFound);

    const htmlMessage = `
    <div>
      <h1>Forgot your password? if you didnt forget your password then ignore this link</h1>
      <p>Use the following code to verify your account : <h3  font-weight : bold ; text-align: center ">${code} </h3></p>
      <h6 style ="font-weight : bold">Ecommerce-NestJs </h6>
    </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      html: htmlMessage,
    });

    return {
      status: HttpStatus.OK,
      message: 'Check your email to reset your password',
    };
  }

  async verifyCode(resetPasswordDto: ResetPasswordDto) {
    const { email, code } = resetPasswordDto;
    const isFound = await this.userRepository.findOneBy({ email });

    if (!isFound) {
      throw new HttpException('Something bad happened', HttpStatus.BAD_REQUEST);
    }

    if (
      isFound.resetPasswordCode !== code ||
      isFound.resetPasswordCodeExpires < new Date()
    ) {
      throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);
    }

    isFound.resetPasswordCode = null;
    isFound.resetPasswordCodeExpires = null;

    return {
      status: HttpStatus.OK,
      message: 'Code verified',
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, newPassword } = changePasswordDto;

    const isFound = await this.userRepository.findOneBy({ email });

    if (!isFound) {
      throw new HttpException('Something bad happened', HttpStatus.BAD_REQUEST);
    }

    const isHashed = await bcrypt.hash(newPassword, 10);

    isFound.password = isHashed;

    await this.userRepository.save(isFound);

    return {
      status: HttpStatus.OK,
      message: 'Password changed successfully',
    };
  }


  async findUser(userId){
    const user = await this.userRepository.findOneBy({id : userId})

    if(!user){
      throw new NotFoundException("User not found")
    }

    return {
      id : user.id,
      fullName : user.fullName,
      email : user.email
    }
  }

  async findAllUsers(){
    const users = await this.userRepository.find()
    return {
      status : HttpStatus.OK,
      data : {
        users
      }
    }
  }
}
