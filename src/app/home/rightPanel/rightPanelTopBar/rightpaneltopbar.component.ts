import { Component, Input, OnInit } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from '../../services/httpService';
import { PanelService } from '../../services/panelService';

@Component({
  standalone: false,
  selector: 'right-panel-top-bar',
  templateUrl: './rightpaneltopbar.component.html',
  styleUrls: ['./rightpaneltopbar.component.scss'],
})
export class RightPanelTopBarComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private panelService: PanelService,
  ) {}

  @Input() nbPkmn: number = 0;
  @Input() pkmnData: any = [];

  // Next and previous pkmns to display on top bar
  pkmnAround: any = { prev: [], next: [] };

  // Service used to update the right panel when selecting a pokémon on the top bar
  sendPkmnToDisplay(pkmnName): void {
    this.panelService.sendPkmnToDisplayEvent(pkmnName);
  }

  ngOnInit() {
    if (this.pkmnData) {
      this.getAroundPkmn(this.pkmnData.id);
    }
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  getAroundPkmn(pkmnId: number) {
    this.pkmnAround = {};
    if (pkmnId > 1) {
      this.httpService.get('https://pokeapi.co/api/v2/pokemon/' + (pkmnId - 1)).subscribe(
        (result) => {
          this.pkmnAround.prev = this.httpService.requestResultHandler(result);
        },
        (error) => {
          throwError(error);
        },
      );
    }
    this.httpService
      .get('https://pokeapi.co/api/v2/pokemon/' + (pkmnId + 1))
      .pipe(
        catchError((e: any) => {
          return of(false); // Well anyway, it doesn't prevent the 404 error in the console so...
        }),
      )
      .subscribe((result) => {
        this.pkmnAround.next = this.httpService.requestResultHandler(result);
      });
  }

  capitalize(str: string) {
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
