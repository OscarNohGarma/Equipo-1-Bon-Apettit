import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '../../../auth/admin-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-admin',
  standalone: true,
  imports: [],
  templateUrl: './inicio-admin.component.html',
  styleUrl: './inicio-admin.component.scss',
})
export class InicioAdminComponent implements OnInit {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}
  ngOnInit(): void {}
}
