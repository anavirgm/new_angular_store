import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage, RouterLink],
  template: `
    <footer class="main-footer">
      <div class="footer-content">
        <a routerLink="/" class="footer-brand" aria-label="AURA Store, ir al catálogo">
          <img ngSrc="/aura-mark.svg" width="36" height="36" alt="" />
          <span>AURA Store</span>
        </a>
        <nav class="footer-links" aria-label="Información legal">
          <a routerLink="/terms">Términos y condiciones</a>
          <a routerLink="/privacy">Política de privacidad</a>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>Copyright © 2026 AURA Store. Todos los derechos reservados.</span>
      </div>
    </footer>
  `
})
export class FooterComponent {}
