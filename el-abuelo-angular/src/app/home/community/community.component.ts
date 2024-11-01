import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommunityService } from '../../core/services/comentario.service';
import { Community } from '../../core/models/comentario';
import { AdminAuthService } from '../../auth/admin-auth.service';
declare var Swal: any;

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
  providers: [CommunityService, AdminAuthService],
})
export class CommunityComponent implements OnInit {
  comentarioItems: Community[] = [];

  constructor(
    private router: Router,
    private communityService: CommunityService,
    private adminAuthService: AdminAuthService
  ) {}
  ngOnInit(): void {
    this.loadComment();
  }

  loadComment() {
    this.communityService.getAll().subscribe((data) => {
      this.comentarioItems = data.filter(comentario =>
        comentario.id.toString() != this.adminAuthService.getId()      
      );
    });
  }
  

}