import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { InicioComponent } from '../../home/inicio/inicio.component';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterOutlet, InicioComponent, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
