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
    public adminAuthService: AdminAuthService,
    
    
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
        item => parseInt(item.comentario.calification) === calificacion
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
        comentario => comentario.id.toString() !== this.adminAuthService.getId()
      );

      const comentariosMap = new Map<number, ComentarioWithReplies>();

      comentariosFiltrados
        .filter(c => !c.parentId)
        .forEach(comentario => {
          comentariosMap.set(comentario.id, {
            comentario,
            respuestas: [],
            showReplyForm: false
          });
        });

      comentariosFiltrados
        .filter(c => c.parentId)
        .forEach(respuesta => {
          const parentId = respuesta.parentId!;
          if (comentariosMap.has(parentId)) {
            comentariosMap.get(parentId)!.respuestas.push(respuesta);
          }
        });

      comentariosMap.forEach(item => {
        item.respuestas.sort((a, b) => {
          const fechaA = this.parseFecha(a.fecha, a.hora);
          const fechaB = this.parseFecha(b.fecha, b.hora);
          return fechaA.getTime() - fechaB.getTime();
        });
      });

      this.comentariosEstructurados = Array.from(comentariosMap.values())
        .sort((a, b) => {
          const fechaA = this.parseFecha(a.comentario.fecha, a.comentario.hora);
          const fechaB = this.parseFecha(b.comentario.fecha, b.comentario.hora);
          return fechaB.getTime() - fechaA.getTime();
        });

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
      confirmButtonColor: '#d33',  // Color de fondo del botón de confirmar
      cancelButtonColor: '#aaa',  // Color de fondo del botón de cancelar
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#dc3545';  // Botón Eliminar
          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#c82333';  // Hover sobre Eliminar
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#dc3545';  // Volver al color inicial
          };
        }
  
        const cancelButton = Swal.getCancelButton();
        if (cancelButton) {
          cancelButton.style.backgroundColor = '#6c757d';  // Botón Cancelar
          cancelButton.onmouseover = () => {
            cancelButton.style.backgroundColor = '#5a6268';  // Hover sobre Cancelar
          };
          cancelButton.onmouseout = () => {
            cancelButton.style.backgroundColor = '#6c757d';  // Volver al color inicial
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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
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