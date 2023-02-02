import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface attachment {
  onBase64: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getNombreDelServicio() {
    return this.http.get<attachment[]>('assets/test.json');
  }
}
