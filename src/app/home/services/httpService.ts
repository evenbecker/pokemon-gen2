import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable()
export class HttpService {

    constructor(private http: HttpClient) {}

    data: JSON;

    get(url: string) {
        return this.http.get(url, {observe: 'body', responseType: 'json'})
    }

    requestResultHandler(object) {
        return JSON.parse(JSON.stringify(object))
    }

}