import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Injectable()
export class ThemeService {

    private themeSubject: Subject<any> = new ReplaySubject(1);

    get $getEventSubject(): Observable<any> {
        return this.themeSubject.asObservable();
    }
    resetEventObserver(): void {
        this.themeSubject = new ReplaySubject(1);
    }

    sendCustomEvent(isDarkTheme):void {
        this.themeSubject.next(isDarkTheme);
    }
}