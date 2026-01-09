import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Injectable()
export class PanelService {

    private pkmnToDisplaySubject: Subject<any> = new ReplaySubject(1);
    private favPkmnFromLeftSubject: Subject<any> = new ReplaySubject(1);
    private favPkmnFromRightSubject: Subject<any> = new ReplaySubject(1);


    // Pokémon to show
    get $getPkmnToDisplayEventSubject(): Observable<any> {
        return this.pkmnToDisplaySubject.asObservable();
    }
    resetPkmnToDisplayEventObserver(): void {
        this.pkmnToDisplaySubject = new ReplaySubject(1);
    }
    sendPkmnToDisplayEvent(newPkmnName):void {
        this.pkmnToDisplaySubject.next(newPkmnName);
    }

    // Favourite pokémon update
    get $getUpdateFavPkmnFromLeftEventSubject(): Observable<any> {
        return this.favPkmnFromLeftSubject.asObservable();
    }
    get $getUpdateFavPkmnFromRightEventSubject(): Observable<any> {
        return this.favPkmnFromRightSubject.asObservable();
    }
    resetUpdateFavPkmnEventObserver(): void {
        this.favPkmnFromLeftSubject = new ReplaySubject(1);
        this.favPkmnFromRightSubject = new ReplaySubject(1);
    }
    sendUpdateFavPkmnToRightEvent(pkmnName):void {
        this.favPkmnFromLeftSubject.next(pkmnName);
    }
    sendUpdateFavPkmnToLeftEvent(pkmnName):void {
        this.favPkmnFromRightSubject.next(pkmnName);
    }
}