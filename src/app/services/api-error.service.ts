import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  logServerError(error: HttpErrorResponse): void {
    const isFakeStore = error.url?.includes('fakestoreapi.com');
    const target = isFakeStore ? 'Fake Store API' : error.url ? `servidor (${error.url})` : 'servidor';
    console.error(`Error del ${target}`, {
      status: error.status,
      url: error.url
    });
  }
}