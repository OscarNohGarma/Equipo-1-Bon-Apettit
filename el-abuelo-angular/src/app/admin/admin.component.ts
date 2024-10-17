import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../shared/admin-header/admin-header.component';
import { AdminFooterComponent } from '../shared/admin-footer/admin-footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AdminHeaderComponent, AdminFooterComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {}
