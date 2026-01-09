import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../home/services/settingsService';
import { Settings } from './settings';

@Component({
  standalone: false,
  selector: 'settings-component',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private settingsService: SettingsService,
    private toastrService: ToastrService,
  ) {}

  // Settings
  settingsDict: Settings = new Settings(20, false); // Default values init

  tmpTheme: boolean;
  tmpNbPkmnByPage: number;

  nbPkmnByPageChoices = [5, 10, 15, 20, 25];

  currentNbPkmnByPage: number = 0;

  // Cookies
  settingsCookie: any;
  settingsCookieName: string = 'settings_cookie';
  favCookieName: string = 'fav_cookie';

  // Service used to update the right panel when selecting a pokémon on the left panel list
  sendNewSettingsDict(): void {
    this.settingsService.sendCustomEvent(this.settingsDict);
  }

  ngOnInit() {
    this.updateCookies();
    this.tmpTheme = this.settingsDict.isDarkTheme;
    this.tmpNbPkmnByPage = this.settingsDict.nbPkmnByPage;
  }

  switchTheme() {
    this.tmpTheme = !this.tmpTheme;
  }

  changeNbPkmnByPage(value: number) {
    this.tmpNbPkmnByPage = value;
  }

  saveSettings(): boolean {
    if (this.checkNbPkmnByPage()) {
      this.settingsDict.isDarkTheme = this.tmpTheme;
      this.settingsDict.nbPkmnByPage = this.tmpNbPkmnByPage;
      this.addCookie();
      this.toastrService.success('Settings succesfully saved!', 'Settings');
      return true;
    } else {
      return false;
    }
  }

  checkNbPkmnByPage(): boolean {
    if (this.tmpNbPkmnByPage > 1) {
      return true;
    } else {
      this.toastrService.error(
        'Cannot set number of Pokémons by page on left panel to ' +
          this.tmpNbPkmnByPage +
          '.\nValue is 0 or negative',
        'Error',
      );
      return false;
    }
  }

  resetSettings() {
    this.settingsDict = new Settings(20, false);
    this.addCookie();
    this.updateCookies();
  }

  addCookie() {
    this.cookieService.set(this.settingsCookieName, JSON.stringify(this.settingsDict));
    this.updateCookies();
    this.sendNewSettingsDict();
  }

  removeSettingsCookie() {
    this.cookieService.delete('settings_cookie');
    this.refreshPage();
  }

  refreshPage() {
    location.reload();
  }

  updateCookies() {
    this.settingsCookie = this.cookieService.get(this.settingsCookieName);
    if (this.settingsCookie && typeof this.settingsCookie === 'string') {
      Object.assign(this.settingsDict, JSON.parse(this.settingsCookie));
    }
  }
}
