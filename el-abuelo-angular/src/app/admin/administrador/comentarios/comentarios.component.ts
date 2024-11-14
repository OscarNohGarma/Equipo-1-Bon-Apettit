import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommunityService } from '../../../core/services/comentario.service';
import { Community } from '../../../core/models/comentario';
import { AdminAuthService } from '../../../auth/admin-auth.service';
import { CommonModule } from '@angular/common';
import { AddReplyComponent } from './add-reply/add-reply.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface ComentarioWithReplies {
  comentario: Community;
  respuestas: Community[];
  showReplyForm: boolean;
}

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, RouterModule, AddReplyComponent],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
  providers: [CommunityService, AdminAuthService, FormsModule],
})
export class ComentariosComponent implements OnInit {
  comentariosEstructurados: ComentarioWithReplies[] = [];
  activeReplyId: number | null = null;
  comentariosFiltrados: ComentarioWithReplies[] = [];
  calificacionSeleccionada: number | null = null;
  @Input() description: string = '';

  constructor(
    private router: Router,
    private communityService: CommunityService,
    public adminAuthService: AdminAuthService
  ) {}

  ngOnInit(): void {
    this.loadComentarios();
  }

  filtrarPorCalificacion(calificacion: number | null): void {
    this.calificacionSeleccionada = calificacion;
    if (calificacion === null) {
      this.comentariosFiltrados = [...this.comentariosEstructurados];
    } else {
      this.comentariosFiltrados = this.comentariosEstructurados.filter(
        (item) => parseInt(item.comentario.calification) === calificacion
      );
    }
  }

  private parseFecha(date: string, time: string): Date {
    const [dia, mes, anio] = date.split('/').map(Number);
    const [hora, minuto, segundo] = time.split(':').map(Number);
    return new Date(anio, mes - 1, dia, hora, minuto, segundo);
  }

  loadComentarios(): void {
    this.communityService.getAll().subscribe((comentarios) => {
      const comentariosFiltrados = comentarios.filter(
        (comentario) =>
          comentario.id.toString() !== this.adminAuthService.getId()
      );

      const comentariosMap = new Map<number, ComentarioWithReplies>();

      comentariosFiltrados
        .filter((c) => !c.parentId)
        .forEach((comentario) => {
          comentariosMap.set(comentario.id, {
            comentario,
            respuestas: [],
            showReplyForm: false,
          });
        });

      comentariosFiltrados
        .filter((c) => c.parentId)
        .forEach((respuesta) => {
          const parentId = respuesta.parentId!;
          if (comentariosMap.has(parentId)) {
            comentariosMap.get(parentId)!.respuestas.push(respuesta);
          }
        });

      comentariosMap.forEach((item) => {
        item.respuestas.sort((a, b) => {
          const fechaA = this.parseFecha(a.fecha, a.hora);
          const fechaB = this.parseFecha(b.fecha, b.hora);
          return fechaA.getTime() - fechaB.getTime();
        });
      });

      this.comentariosEstructurados = Array.from(comentariosMap.values()).sort(
        (a, b) => {
          const fechaA = this.parseFecha(a.comentario.fecha, a.comentario.hora);
          const fechaB = this.parseFecha(b.comentario.fecha, b.comentario.hora);
          return fechaB.getTime() - fechaA.getTime();
        }
      );

      this.comentariosFiltrados = [...this.comentariosEstructurados];
    });
  }

  responderComentario(comentarioId: number): void {
    if (this.activeReplyId === comentarioId) {
      this.activeReplyId = null;
    } else {
      this.activeReplyId = comentarioId;
    }
  }

  onReplySubmitted(): void {
    this.loadComentarios();
    this.activeReplyId = null;
  }

  eliminarComentario(comentarioId: number): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro de eliminar este comentario?',
      text: 'Esta acción no puede deshacerse.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false, // Desactivar estilos predeterminados de SweetAlert2
      didOpen: () => {
        // Aplicar estilos directamente
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton) {
          confirmButton.style.backgroundColor = '#fff';
          confirmButton.style.color = '#dc3545';
          confirmButton.style.padding = '10px 20px';
          confirmButton.style.fontWeight = 'bold';
          confirmButton.style.border = 'none';
          confirmButton.style.border = '2px solid #dc3545';
          confirmButton.style.borderRadius = '5px';
          confirmButton.style.transition = 'background-color 0.3s ease'; // Agregar transición
          confirmButton.style.marginRight = '10px'; // Agregar transición

          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#dc3545'; // Color en hover
            confirmButton.style.color = '#fff';
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#fff'; // Color normal
            confirmButton.style.color = '#dc3545';
          };
        }

        if (cancelButton) {
          cancelButton.style.backgroundColor = '#343a40';
          cancelButton.style.color = '#fff';
          cancelButton.style.padding = '10px 20px';
          cancelButton.style.fontWeight = 'bold';
          cancelButton.style.border = 'none';
          cancelButton.style.border = '2px solid #343a40';
          cancelButton.style.borderRadius = '5px';
          cancelButton.style.transition = 'background-color 0.3s ease'; // Agregar transición

          cancelButton.onmouseover = () => {
            cancelButton.style.backgroundColor = '#24272b'; // Color en hover
          };
          cancelButton.onmouseout = () => {
            cancelButton.style.backgroundColor = '#343a40'; // Color normal
          };
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.communityService.delete(comentarioId.toString()).subscribe(
          () => {
            // Recargar los comentarios después de la eliminación
            this.loadComentarios();
          },
          (error) => {
            console.error('Error al eliminar el comentario:', error);
          }
        );
      }
    });
  }

  eliminarRespuesta(respuestaId: number): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro de eliminar esta respuesta?',
      text: 'Esta acción no puede deshacerse.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false, // Desactivar estilos predeterminados de SweetAlert2
      didOpen: () => {
        // Aplicar estilos directamente
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton) {
          confirmButton.style.backgroundColor = '#fff';
          confirmButton.style.color = '#dc3545';
          confirmButton.style.padding = '10px 20px';
          confirmButton.style.fontWeight = 'bold';
          confirmButton.style.border = 'none';
          confirmButton.style.border = '2px solid #dc3545';
          confirmButton.style.borderRadius = '5px';
          confirmButton.style.transition = 'background-color 0.3s ease'; // Agregar transición
          confirmButton.style.marginRight = '10px'; // Agregar transición

          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#dc3545'; // Color en hover
            confirmButton.style.color = '#fff';
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#fff'; // Color normal
            confirmButton.style.color = '#dc3545';
          };
        }

        if (cancelButton) {
          cancelButton.style.backgroundColor = '#343a40';
          cancelButton.style.color = '#fff';
          cancelButton.style.padding = '10px 20px';
          cancelButton.style.fontWeight = 'bold';
          cancelButton.style.border = 'none';
          cancelButton.style.border = '2px solid #343a40';
          cancelButton.style.borderRadius = '5px';
          cancelButton.style.transition = 'background-color 0.3s ease'; // Agregar transición

          cancelButton.onmouseover = () => {
            cancelButton.style.backgroundColor = '#24272b'; // Color en hover
          };
          cancelButton.onmouseout = () => {
            cancelButton.style.backgroundColor = '#343a40'; // Color normal
          };
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.communityService.delete(respuestaId.toString()).subscribe(
          () => {
            // Recargar los comentarios después de la eliminación
            this.loadComentarios();
          },
          (error) => {
            console.error('Error al eliminar la respuesta:', error);
          }
        );
      }
    });
  }

  editarRespuesta(respuesta: Community): void {
    this.activeReplyId = respuesta.id; // Activamos la respuesta que se va a editar
    this.description = respuesta.description; // Llenamos la descripción para editar
  }
}
