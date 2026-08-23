import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  template: `
    <main class="legal-page page-shell">
      <a routerLink="/" class="text-link">← Volver al catálogo</a>
      <span class="eyebrow">AURA STORE</span>
      <h1>Política de privacidad</h1>
      <p class="legal-intro">Respetamos tu privacidad y explicamos de forma clara cómo tratamos la información de la aplicación.</p>
      <section class="legal-section">
        <h2>Información de sesión</h2>
        <p>El token de autenticación se guarda localmente en tu navegador para mantener tu sesión activa. Puedes eliminarlo cerrando sesión.</p>
      </section>
      <section class="legal-section">
        <h2>Datos de navegación</h2>
        <p>No vendemos información personal. Los datos enviados a la Fake Store API se utilizan únicamente para autenticarte y mostrar el catálogo.</p>
      </section>
      <section class="legal-section">
        <h2>Control de tus datos</h2>
        <p>Puedes cerrar sesión en cualquier momento y borrar los datos locales del sitio desde la configuración de tu navegador.</p>
      </section>
    </main>
  `
})
export class PrivacyComponent {}
