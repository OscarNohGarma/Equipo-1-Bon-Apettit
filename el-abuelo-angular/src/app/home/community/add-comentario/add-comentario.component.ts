import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Community } from '../../../core/models/comentario';
import { CommunityService } from '../../../core/services/comentario.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
declare var Swal: any;

@Component({
  selector: 'app-add-comentario',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, SpinnerComponent],
  templateUrl: './add-comentario.component.html',
  styleUrls: ['./add-comentario.component.scss'],
  providers: [CommunityService, AuthService],
})
export class AddComentarioComponent implements OnInit {
  description: string = '';
  calification: string | null = null;
  comments: Community[] = [];
  currentName: string | null = null;
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
  }

  private checkAuthentication(): void {
    this.currentUser = this.authService.getUser();
    this.currentName = this.authService.getUsername();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
  }

  submitComment(): void {
    if (!this.description || !this.calification) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const newComment = new Community(
      0,
      this.currentName || '',
      this.description,
      this.calification,
      new Date().toLocaleDateString(),
      new Date().toLocaleTimeString(),
      this.currentUser || ''
    );

    this.communityService.add(newComment).subscribe({
      next: () => {
        this.handleSuccessfulSubmission();
      },
      error: (error) => {
        this.handleSubmissionError(error);
      },
    });
  }

  private handleSuccessfulSubmission(): void {
    // Configuración y visualización de SweetAlert al enviar el comentario exitosamente
    this.loading = false;
    Swal.fire({
      icon: 'success',
      title: '¡Comentario enviado exitosamente!',
      text: 'Gracias por compartir tu opinión.',
      confirmButtonText: 'Aceptar',
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#343a40';
          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#212529';
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#343a40';
          };
        }
      },
    }).then(() => {
      this.router.navigate(['/comunidad']).then(() => {});
    });
  }

  private handleSubmissionError(error: any): void {
    console.error('Error al crear el comentario:', error);
    this.errorMessage =
      'Ocurrió un error al enviar el comentario. Por favor intenta nuevamente.';
    this.loading = false;
  }
}
