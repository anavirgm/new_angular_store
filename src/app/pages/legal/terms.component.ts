import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  imports: [RouterLink],
  template: `
    <main class="legal-page page-shell">
      <a routerLink="/" class="text-link">← Volver al catálogo</a>
      <span class="eyebrow">AURA STORE</span>
      <h1>Términos y condiciones</h1>
      <p class="legal-intro">Estas condiciones describen las reglas generales para utilizar nuestra tienda online.</p>
      <section class="legal-section">
        <h2>Uso de la tienda</h2>
        <p>Al navegar por AURA Store aceptas utilizar el sitio de forma responsable y proporcionar información correcta cuando sea necesario.</p>
      </section>
      <section class="legal-section">
        <h2>Productos y pedidos</h2>
        <p>La disponibilidad, precios e imágenes pueden actualizarse. Un pedido queda sujeto a confirmación y disponibilidad del producto.</p>
      </section>
      <section class="legal-section">
        <h2>Contacto</h2>
        <p>Para consultas sobre un pedido o estas condiciones, utiliza los canales de contacto disponibles en la plataforma.</p>
      </section>
    </main>
  `
})
export class TermsComponent {}
