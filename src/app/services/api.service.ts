import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public sendFile(json: any, blob: Blob, fileName: string): Observable<any> {
    return forkJoin([this.sendFormJson(json), this.sendFormBlob(blob, fileName)]);
  }

  private sendFormJson(data: any): Observable<any> {
    // return this.http.post('someUrl/api/json', data).pipe(catchError(err => of(err)));
    return of({ data: data, status: 'OK', code: 200, message: 'Saving data succeeded' });
    // return of({ data: data, status: 'NOK', code: 400, message: 'Saving data did not succeed' });
  }

  private sendFormBlob(blob: Blob, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', blob, fileName);
    // return this.http.post('someUrl/api/blob', formData).pipe(catchError(err => of(err)));
    // return of({ data: fileName, status: 'OK', code: 200, message: 'Saving file succeeded' }).pipe(delay(2000));
    return of({ data: null, status: 'NOK', code: 500, message: 'Saving file did not succeed' }).pipe(delay(2000));
  }



  // promises: 

  // public sendFile(json: any, blob: Blob, fileName: string): Promise<any> {
  //   return Promise.all([
  //     this.sendFormJson(json).catch(err => err), 
  //     this.sendFormBlob(blob, fileName).catch(err => err)
  //   ]);
  // }

  // private async sendFormJson(data: any): Promise<any> {
  //   // return await firstValueOf(this.http.post('someURL/api/json', data));
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   return { data: data, status: 'OK', code: 200, message: 'Success' };
  //   // return { data: data, status: 'NOK', code: 400, message: 'Error' };
  // }

  // private async sendFormBlob(blob: Blob, fileName: string): Promise<any> {
  //   const formData = new FormData();
  //   formData.append('file', blob, fileName);
  //   // return await firstValueOf(this.http.post('someURL/api/blob', formData));
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   return { data: fileName, status: 'OK', code: 200, message: 'Success' };
  //   // return { data: fileName, status: 'NOK', code: 500, message: 'Error' };
  // }
}
