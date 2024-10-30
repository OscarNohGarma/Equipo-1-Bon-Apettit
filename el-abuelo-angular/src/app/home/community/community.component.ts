import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Community } from '../../core/models/community';
import { CommunityService } from '../../core/services/community.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SpinnerComponent
  ],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
  providers: [CommunityService, AuthService]
})
export class CommunityComponent implements OnInit {
  description: string = '';
  calification: string | null = null;
  comments: Community[] = [];
  currentUser: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private communityService: CommunityService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadComments();
  }

  private checkAuthentication(): void {
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
  }

  loadComments(): void {
    this.loading = true;
    this.communityService.getAll().subscribe({
      next: (data) => {
        this.comments = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los comentarios';
        this.loading = false;
      }
    });
  }

  submitComment(): void {
    if (!this.description || !this.calification) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Crear nueva instancia de Community
    const newComment = new Community(
      0, // ID temporal
      'Comentario', // Nombre por defecto
      this.description,
      this.calification,
      new Date().toLocaleDateString(), // Fecha actual
      new Date().toLocaleTimeString(), // Hora actual
      this.currentUser || 'Anónimo'
    );

    // Usar el método create del servicio genérico
    this.communityService.add(newComment).subscribe({
      next: () => {
        this.handleSuccessfulSubmission();
      },
      error: (error) => {
        this.handleSubmissionError(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private handleSuccessfulSubmission(): void {
    // Limpiar el formulario
    this.description = '';
    this.calification = null;
    this.errorMessage = null;

    // Recargar los comentarios para mostrar el nuevo
    this.loadComments();
  }

  private handleSubmissionError(error: any): void {
    console.error('Error al crear el comentario:', error);
    this.errorMessage = 'Ocurrió un error al enviar el comentario. Por favor intenta nuevamente.';
    this.loading = false;
  }
}
