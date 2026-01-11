import { Component, Input, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { HttpService } from '../services/httpService';
import { PanelService } from '../services/panelService';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faCircleNotch, faPhoneVolume, faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ng2-cookies';

@Component({
  standalone: false,
  selector: 'right-panel-component',
  templateUrl: './rightpanel.component.html',
  styleUrls: ['./rightpanel.component.scss'],
})
export class RightPanelComponent implements OnInit {
  dataReceived: boolean = false;

  @Input() nbPkmn: number = 0;
  @Input() nbPkmnGens: number = 0;

  loading: boolean = true;

  pkmnName: string = '';
  isFavPkmn: boolean;

  // Fav Pkmn cookie
  favPkmnCookieName: string = 'fav_cookie';

  pkmnData: any;

  movesData: Array<any> = [];

  constructor(
    private httpService: HttpService,
    private panelService: PanelService,
    private toastr: ToastrService,
    public faLibrary: FaIconLibrary,
    private cookieService: CookieService,
  ) {
    // FontAwesome icons
    faLibrary.addIcons(fasStar);
    faLibrary.addIcons(farStar);
    faLibrary.addIcons(faCircleNotch);

    // To receive from PanelService about the pokémon to show on the right panel
    this.panelService.$getPkmnToDisplayEventSubject.subscribe((newPkmnName) => {
      this.pkmnName = newPkmnName;
      this.ngOnInit();
    });
    // To receive from PanelService to update favorite pokémon FROM LEFT
    this.panelService.$getUpdateFavPkmnFromLeftEventSubject.subscribe(() => {
      this.updateFavPkmns();
      this.ngOnInit();
    });
  }

  updateFavPkmns() {
    this.isFavPkmn = this.cookieService
      .get(this.favPkmnCookieName)
      .split(',')
      .includes(this.pkmnName);
  }

  ngOnInit() {
    if (this.pkmnName && this.pkmnName != '') {
      this.loading = true;
      this.requestPkmnData();
      this.getIfFavPkmn();
    } else {
      this.dataReceived = true;
    }
  }

  requestPkmnData() {
    this.httpService.get('https://pokeapi.co/api/v2/pokemon/' + this.pkmnName).subscribe(
      (result) => {
        this.pkmnData = this.httpService.requestResultHandler(result);

        this.requestMovesData();
      },
      (error) => {
        throwError(error);
        this.toastr.error('Could not find any Pokémon with such name. Please try again.');
        return throwError(error);
      },
      () => {
        this.loading = false;
        this.dataReceived = true;
      },
    );
  }

  getIfFavPkmn(): boolean {
    let cookie = this.cookieService.get(this.favPkmnCookieName);
    if (cookie) {
      this.isFavPkmn = cookie.split(',').includes(this.pkmnName);
      return true;
    } else {
      this.isFavPkmn = false;
      return false;
    }
  }

  requestMovesData() {
    this.movesData = []; // Reset
    for (let move of this.pkmnData.moves) {
      if (move.version_group_details[0].move_learn_method.name === 'level-up') {
        this.httpService.get('https://pokeapi.co/api/v2/move/' + move.move.name).subscribe(
          (result) => {
            let tmp = this.httpService.requestResultHandler(result);
            tmp.level_learned_at = move.version_group_details[0].level_learned_at;
            this.movesData.push(tmp);
            // This sort is.... kind bad, but the synchronous loop prevents me from doing it at the end
            this.movesData = this.movesData.sort((a, b) => {
              return a.level_learned_at - b.level_learned_at;
            });
          },
          (error) => {
            throwError(error);
          },
        );
      }
    }
  }

  addNewFavPkmn(pkmnName: string) {
    let favPkmnsArray = [];
    let cookie = this.cookieService.get(this.favPkmnCookieName);
    if (!cookie || cookie.length <= 0) {
      favPkmnsArray = [pkmnName];
    } else {
      favPkmnsArray = cookie.split(',');
      if (!favPkmnsArray.includes(pkmnName)) {
        favPkmnsArray.push(pkmnName);
      }
    }
    this.cookieService.set(this.favPkmnCookieName, favPkmnsArray.toString());
    this.panelService.sendUpdateFavPkmnToLeftEvent(pkmnName);
    this.isFavPkmn = true;
  }

  removeFavPkmn(pkmnName: string): boolean {
    let favPkmnsArray = this.cookieService.get(this.favPkmnCookieName).split(',');
    if (favPkmnsArray.indexOf(pkmnName) != -1) {
      favPkmnsArray.splice(favPkmnsArray.indexOf(pkmnName), 1);
      this.cookieService.set(this.favPkmnCookieName, favPkmnsArray.toString());
      this.panelService.sendUpdateFavPkmnToLeftEvent(pkmnName);
      this.isFavPkmn = false;
      return true;
    } else {
      return false;
    }
  }

  capitalize(str: string) {
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // In Kilograms
  convertWeight(weight: number) {
    if (weight) {
      return weight / 10;
    } else {
      return 'Error, no weight found.';
    }
  }

  // In Meter
  convertHeight(height: number) {
    if (height) {
      return height / 10;
    } else {
      return 'Error, no height found.';
    }
  }
}
