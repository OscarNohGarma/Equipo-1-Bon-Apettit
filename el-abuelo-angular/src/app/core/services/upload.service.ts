import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'http://localhost:3000/upload';

  constructor(private http: HttpClient) {}

  // Método para subir la imagen
  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file); // Clave 'file', como lo haces en Postman

    // Realiza la petición POST para subir la imagen
    return this.http.post(`${this.apiUrl}`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  // Método para obtener una imagen por nombre de archivo
  getImage(fileName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${fileName}`);
  }

  // Método para eliminar una imagen por nombre de archivo
  deleteImage(fileName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fileName}`);
  }
}
