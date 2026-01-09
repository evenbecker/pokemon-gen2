import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Injectable()
export class SettingsService {

    private settingsDictSubject: Subject<any> = new ReplaySubject(1);

    get $getEventSubject(): Observable<any> {
        return this.settingsDictSubject.asObservable();
    }
    resetEventObserver(): void {
        this.settingsDictSubject = new ReplaySubject(1);
    }

    sendCustomEvent(newSettingsDict):void {
        this.settingsDictSubject.next(newSettingsDict);
    }
}