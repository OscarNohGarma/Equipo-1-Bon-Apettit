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
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SpinnerComponent
  ],
  templateUrl: './add-comentario.component.html',
  styleUrls: ['./add-comentario.component.scss'],
  providers: [CommunityService, AuthService]
})
export class AddComentarioComponent implements OnInit {
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

    const newComment = new Community(
      0,
      'Comentario',
      this.description,
      this.calification,
      new Date().toLocaleDateString(),
      new Date().toLocaleTimeString(),
      this.currentUser || 'Anónimo'
    );

    this.communityService.add(newComment).subscribe({
      next: () => {
        this.handleSuccessfulSubmission();
      },
      error: (error) => {
        this.handleSubmissionError(error);
      }
    });
  }

  private handleSuccessfulSubmission(): void {
    this.description = '';
    this.calification = null;
    this.errorMessage = null;
    this.loadComments();
    
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
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          window.scroll(0, 0);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }, 500);
      });
    });
  }

  private handleSubmissionError(error: any): void {
    console.error('Error al crear el comentario:', error);
    this.errorMessage = 'Ocurrió un error al enviar el comentario. Por favor intenta nuevamente.';
    this.loading = false;
  }
}
