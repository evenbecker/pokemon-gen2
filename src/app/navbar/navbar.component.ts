import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCog, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ng2-cookies';
import { PanelService } from '../home/services/panelService';
import { SettingsService } from '../home/services/settingsService';

@Component({
  standalone: false,
  selector: 'navbar-component',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private panelService: PanelService,
    private settingsService: SettingsService,
    private cookieService: CookieService,
  ) {
    this.settingsService.$getEventSubject.subscribe((isDarkTheme) => {
      this.isDarkTheme = isDarkTheme;
      this.ngOnInit();
    });
  }

  // FontAwesome Icons
  faSearch = faSearch;
  faHome = faHome;
  faCog = faCog;

  pkmnToSearch: string = '';

  settingsCookieName: string = 'settings_cookie';
  isDarkTheme: boolean;

  ngOnInit() {
    this.getSettingsData();
  }

  getSettingsData() {
    let cookie = this.cookieService.get(this.settingsCookieName);
    if (cookie) {
      this.isDarkTheme = JSON.parse(cookie).isDarkTheme;
    }
  }

  // Service used to update the right panel when selecting a pokémon on the left panel list
  searchPkmn(): void {
    let a = this.panelService.sendPkmnToDisplayEvent(this.pkmnToSearch.toLowerCase());
    this.pkmnToSearch = '';
  }

  resetPkmnToDisplay() {
    this.panelService.sendPkmnToDisplayEvent('');
  }
}
