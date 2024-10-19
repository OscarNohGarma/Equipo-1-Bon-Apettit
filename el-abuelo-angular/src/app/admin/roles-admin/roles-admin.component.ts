import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario';

@Component({
  selector: 'app-roles-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './roles-admin.component.html',
  styleUrl: './roles-admin.component.scss',
  providers: [UsuarioService],
})
export class RolesAdminComponent implements OnInit {
  usuarioItems: Usuario[] = [];

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.getAll().subscribe((data) => {
      this.usuarioItems = data;
      console.log(this.usuarioItems);
    });
  }
  deleteUsuario() {}
}
