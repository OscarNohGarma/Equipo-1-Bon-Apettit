import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../auth/admin-auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { Usuario } from '../../core/models/usuario';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, SpinnerComponent],
  providers: [AdminAuthService, UsuarioService],
})
export class AdminLoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  usuarioItems: Usuario[] = [];
  loading: boolean = false;

  constructor(
    private adminAuthService: AdminAuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioService.getAll().subscribe((data) => {
      this.usuarioItems = data;
      console.log(this.usuarioItems);
    });
  }

  login() {
    if (this.username.trim() === '' || this.password.trim() === '') {
      return; // Detener el envío si hay campos vacíos
    }

    this.errorMessage = '';
    this.loading = true;
    // Buscar si el usuario ingresado existe en la lista de usuarios
    const foundUser = this.usuarioItems.find(
      (user) => user.user === this.username
    );
    setTimeout(() => {
      if (foundUser) {
        // Validar si la contraseña coincide
        if (foundUser.password === this.password) {
          // Login exitoso, simula el almacenamiento del token
          this.adminAuthService.login(
            'fake-token',
            foundUser.id.toString(),
            foundUser.user,
            foundUser.password,
            foundUser.namee,
            foundUser.rol
          ); // Aquí podrías pasar un token real si lo tienes
          this.loading = false;
          this.router.navigate(['/admin']).then(() => {
            // Forzar la recarga de la página después de la navegación
            window.location.reload();
          });
        } else {
          // Contraseña incorrecta
          this.errorMessage = 'Contraseña incorrecta. Inténtalo de nuevo.';
          this.loading = false;
        }
      } else {
        // Usuario no encontrado
        this.errorMessage = 'Usuario no encontrado. Inténtalo de nuevo.';
        this.loading = false;
      }
    }, 2000);
  }
}
