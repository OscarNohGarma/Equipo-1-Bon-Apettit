import { Injectable } from '@nestjs/common';
import { firebaseAuth } from '../../firebase.config'; // Ajusta la ruta si es necesario

import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
} from 'firebase/auth';

@Injectable()
export class FireAuthService {
  
  // Envío de enlace de verificación por correo electrónico
  async sendVerificationEmail(email: string): Promise<void> {
    const actionCodeSettings = {
      url: `http://localhost:3000?email=${email}`, // Página de redirección válida
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings);
      console.log('Correo de verificación enviado a:', email);
    } catch (error) {
      console.error('Error al enviar correo de verificación:', error);
      throw new Error('Error al enviar correo de verificación');
    }
  }

  // Inicio de sesión con enlace enviado por correo electrónico
  async loginWithEmailLink(email: string, emailLink: string): Promise<void> {
    try {
      if (isSignInWithEmailLink(firebaseAuth, emailLink)) {
        await signInWithEmailLink(firebaseAuth, email, emailLink);
        console.log('Inicio de sesión exitoso para:', email);
      } else {
        console.error('El enlace proporcionado no es válido para iniciar sesión.');
        throw new Error('El enlace proporcionado no es válido.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Error al iniciar sesión');
    }
  }

}
