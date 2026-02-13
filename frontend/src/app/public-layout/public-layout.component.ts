import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main class="page-enter">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`main { min-height: calc(100vh - 52px - 150px); }`]
})
export class PublicLayoutComponent {}
