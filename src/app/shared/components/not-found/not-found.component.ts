import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="page-shell not-found-page">
      <div class="not-found-container">
        <span class="not-found-code">404</span>
        <h1 class="not-found-title">Página no encontrada</h1>
        <p class="not-found-description">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div class="not-found-actions">
          <a routerLink="/" class="button button-primary">
            ← Volver al catálogo
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 55vh;
      text-align: center;
      padding: 3rem 1rem;
    }
    .not-found-container {
      max-width: 500px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .not-found-code {
      font-size: 5.5rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1;
      color: var(--accent, #a34b1f);
      margin-bottom: 0.5rem;
      opacity: 0.85;
    }
    .not-found-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 1rem;
      color: var(--ink, #27221e);
    }
    .not-found-description {
      font-size: 1rem;
      color: var(--muted, #746b63);
      line-height: 1.5;
      margin: 0 0 2rem;
    }
    .not-found-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  `]
})
export class NotFoundComponent {}
