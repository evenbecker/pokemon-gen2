import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LeftPanelComponent } from './home/leftPanel/leftpanel.component';
import { RightPanelComponent } from './home/rightPanel/rightpanel.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './home/services/httpService';
import { PanelService } from './home/services/panelService';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RightPanelTopBarComponent } from './home/rightPanel/rightPanelTopBar/rightpaneltopbar.component';
import { CookieService } from 'ng2-cookies';
import { SettingsService } from './home/services/settingsService';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ThemeService } from './home/services/themeService';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    App,
    NavbarComponent,
    HomeComponent,
    LeftPanelComponent,
    RightPanelComponent,
    RightPanelTopBarComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    HttpService,
    PanelService,
    SettingsService,
    ThemeService,
    LeftPanelComponent,
    RightPanelComponent,
    SettingsComponent,
    ToastrService,
    CookieService,
  ],
  bootstrap: [App],
})
export class AppModule {}
