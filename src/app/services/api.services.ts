import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
@Injectable({
    providedIn: 'root'
})

export class ApiService {
    expressApiUrl = "https://scity.gmmspl.com:3000";
    invokeFirstComponentFunction = new EventEmitter();
    //subsVar: Subscription;
    constructor(private http: HttpClient) { }

    // httpOptions :any= {
    //     headers: new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'x-access-token': '',
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Credentials": "true",
    //         "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    //         "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    //         "Cache-Control": "",
    //         "X-Requested-With": "",
    //     })
    // };

    handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
           // console.log("my error",error)
           errorMessage = error.error.message;
        }
        return throwError(errorMessage);
    }
    login(formData: any,date:any): Observable<any> {
        return this.http.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=363&date='+date).pipe(
            respdata => respdata,
            catchError(this.handleError)
        );
    }

}
