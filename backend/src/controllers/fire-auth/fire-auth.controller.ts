import { Controller, Post, Body, Get } from '@nestjs/common';
import { FireAuthService } from '../../services/fire-auth/fire-auth.service';

@Controller('firebase/auth')
export class FireAuthController {
  constructor(private readonly fireAuthService: FireAuthService) {}

  // Enviar correo de verificación
  @Post('verification')
  async sendVerification(@Body('email') email: string) {
    await this.fireAuthService.sendVerificationEmail(email);
    return { message: 'Correo de verificación enviado.' };
  }

  // Iniciar sesión con enlace de correo
  @Post('login')
  async login(@Body('email') email: string, @Body('link') emailLink: string) {
    await this.fireAuthService.loginWithEmailLink(email, emailLink);
    return { message: 'Inicio de sesión exitoso.' };
  }

 
}
