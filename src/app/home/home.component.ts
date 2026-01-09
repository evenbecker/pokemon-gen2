import { Component, OnInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ng2-cookies';
import { throwError } from 'rxjs';
import { HttpService } from './services/httpService';
import { SettingsService } from './services/settingsService';
import { ThemeService } from './services/themeService';

@Component({
  standalone: false,
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private httpService: HttpService,
    private cookieService: CookieService,
    private settingsService: SettingsService,
  ) {
    this.settingsService.$getEventSubject.subscribe((isDarkTheme) => {
      this.isDarkTheme = isDarkTheme;
      this.ngOnInit();
    });
  }

  nbPkmn: number = 0;
  nbPkmnGens: number = 0;

  settingsCookieName: string = 'settings_cookie';
  isDarkTheme: boolean;

  ngOnInit() {
    this.getSettingsData();
    this.getNbPkmn();
    this.getPkmnNbGenerations();
  }

  getSettingsData() {
    let cookie = this.cookieService.get(this.settingsCookieName);
    if (cookie) {
      this.isDarkTheme = JSON.parse(cookie).isDarkTheme;
    }
  }
  getNbPkmn() {
    this.nbPkmn = 251;
  }
  getNbPkmnFull() {
    this.httpService.get('https://pokeapi.co/api/v2/pokemon/').subscribe(
      (result) => {
        this.nbPkmn = this.httpService.requestResultHandler(result).count;
      },
      (error) => {
        return throwError(error);
      },
    );
  }
  getPkmnNbGenerations() {
    this.nbPkmnGens = 2;
  }
  getPkmnNbGenerationsFull() {
    this.httpService.get('https://pokeapi.co/api/v2/generation/').subscribe(
      (result) => {
        this.nbPkmnGens = this.httpService.requestResultHandler(result).count;
      },
      (error) => {
        return throwError(error);
      },
    );
  }
}
