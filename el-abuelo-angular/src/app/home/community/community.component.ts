import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommunityService } from '../../core/services/comentario.service';
import { Community } from '../../core/models/comentario';
import { AdminAuthService } from '../../auth/admin-auth.service';
declare var Swal: any;

interface ComentarioWithReplies {
  comentario: Community;
  respuestas: Community[];
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
  providers: [CommunityService, AdminAuthService],
})
export class CommunityComponent implements OnInit {
  comentariosEstructurados: ComentarioWithReplies[] = [];
  comentariosFiltrados: ComentarioWithReplies[] = [];
  calificacionSeleccionada: number | null = null;

  constructor(
    private router: Router,
    private communityService: CommunityService,
    public adminAuthService: AdminAuthService
  ) {}

  ngOnInit(): void {
    this.loadComment();
  }

  private parseFecha(date: string, time: string): Date {
    const [dia, mes, anio] = date.split('/').map(Number);
    const [hora, minuto, segundo] = time.split(':').map(Number);
    return new Date(anio, mes - 1, dia, hora, minuto, segundo);
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

  loadComment() {
    this.communityService.getAll().subscribe((comentarios) => {
      // Crear un mapa temporal para agrupar las respuestas con sus comentarios principales
      const comentariosMap = new Map<number, ComentarioWithReplies>();
  
      // Procesar todos los comentarios principales (no importa si son del admin o de usuarios)
      comentarios
        .filter(c => !c.parentId)
        .forEach(comentario => {
          comentariosMap.set(comentario.id, {
            comentario,
            respuestas: []
          });
        });
  
      // Agregar las respuestas del admin o comentarios del admin
      comentarios
        .filter(c => c.parentId || c.id.toString() === this.adminAuthService.getId())
        .forEach(respuesta => {
          const parentId = respuesta.parentId!;
          if (comentariosMap.has(parentId)) {
            comentariosMap.get(parentId)!.respuestas.push(respuesta);
          }
        });
  
      // Ordenar las respuestas por fecha
      comentariosMap.forEach(item => {
        item.respuestas.sort((a, b) => {
          const fechaA = this.parseFecha(a.fecha, a.hora);
          const fechaB = this.parseFecha(b.fecha, b.hora);
          return fechaA.getTime() - fechaB.getTime();
        });
      });
  
      // Convertir el mapa a array y ordenar los comentarios principales por fecha
      this.comentariosEstructurados = Array.from(comentariosMap.values())
        .sort((a, b) => {
          const fechaA = this.parseFecha(a.comentario.fecha, a.comentario.hora);
          const fechaB = this.parseFecha(b.comentario.fecha, b.comentario.hora);
          return fechaB.getTime() - fechaA.getTime();
        });

        this.comentariosFiltrados = [...this.comentariosEstructurados];
    });
  }
  
}