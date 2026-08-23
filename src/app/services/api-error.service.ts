import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  logServerError(error: HttpErrorResponse): void {
    console.error('Error del servidor al consumir Fake Store API', {
      status: error.status,
      url: error.url
    });
  }
}