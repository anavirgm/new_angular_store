import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  template: `
    <div class="auth-page">
      
      <div class="auth-card">
        
        <div class="auth-heading">
          <img class="auth-logo" ngSrc="/aura-mark.svg" width="64" height="64" alt="AURA Store" />
          <p class="eyebrow">AURA STORE</p>
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        <div class="demo-credentials">
          <strong>Acceso de prueba</strong>
          <span>Usuario: <code>mor_2314</code></span>
          <span>Contraseña: <code>83r5^_</code></span>
        </div>

        <form class="auth-form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="username">Usuario</label>
            <input 
              id="username"
              type="text" 
              [(ngModel)]="username" 
              name="username" 
              placeholder="Ingresa tu usuario" 
              required
            />
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <div class="password-field">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                required
              />
              <button
                class="password-toggle"
                type="button"
                [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                [attr.aria-pressed]="showPassword()"
                (click)="togglePasswordVisibility()">
                <span aria-hidden="true">{{ showPassword() ? '◉' : '◌' }}</span>
              </button>
            </div>
          </div>

          @if (error()) {
            <div class="alert alert-error" role="alert">
              {{ error() }}
            </div>
          }

          <button class="button button-primary" type="submit" [disabled]="loading()">
            {{ loading() ? 'Cargando...' : 'Ingresar' }}
          </button>
        </form>

      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  
  username = '';
  password = '';
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update(visible => !visible);
  }

  onSubmit() {
    if (!this.username || !this.password) return;
    
    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.username, this.password).subscribe({
      error: () => {
        this.error.set('Credenciales inválidas. Por favor intenta de nuevo.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }
}