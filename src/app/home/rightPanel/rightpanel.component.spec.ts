import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ng2-cookies';
import { ToastrModule } from 'ngx-toastr';
import { LeftPanelComponent } from '../leftPanel/leftpanel.component';
import { RightPanelComponent } from '../rightPanel/rightpanel.component';
import { HttpService } from '../services/httpService';
import { PanelService } from '../services/panelService';
import { SettingsService } from '../services/settingsService';

describe('RightPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RightPanelComponent,
      ],
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        HttpService,
        CookieService,
        PanelService,
        SettingsService,
      ],
    }).compileComponents();
  });

  // Init component
  function initComponent() {
        const fixture = TestBed.createComponent(RightPanelComponent);
        return fixture.componentInstance;
  }

  it('get if pokémon is in favourite list', () => {
        const app = initComponent();
        const cookieService: CookieService = new CookieService();

        // Not favourite
        cookieService.delete('fav_cookie');
        app.getIfFavPkmn();
        expect(app.isFavPkmn).toEqual(false);

        // Favourite
        cookieService.set('fav_cookie', 'haunter')
        app.pkmnName = 'haunter'
        app.getIfFavPkmn();
        expect(app.isFavPkmn).toEqual(true);
  });

  it('add new favourite pokémon',() => {
        const app = initComponent();
        const cookieService: CookieService = new CookieService();
        const leftPanel = TestBed.createComponent(LeftPanelComponent).componentInstance;

        // No pkmn in fav cookies
        cookieService.delete('fav_cookie');
        app.addNewFavPkmn('haunter');
        expect(cookieService.get('fav_cookie')).toEqual('haunter')
        expect(app.isFavPkmn).toEqual(true);

        // Check if service gave the information to the left panel
        expect(leftPanel.favPkmnsArray.includes('haunter')).toEqual(true);

        // Adding already existing pokémon
        app.addNewFavPkmn('haunter')
        expect(cookieService.get('fav_cookie')).toEqual('haunter')
        expect(app.isFavPkmn).toEqual(true);

        cookieService.delete('fav_cookie');
  });

  it('remove one favourite pokémon', () => {
        const app = initComponent();
        const cookieService: CookieService = new CookieService();
        const leftPanel = TestBed.createComponent(LeftPanelComponent).componentInstance;
        app.isFavPkmn = true;

        // Create cookie with a favourite pokémon
        cookieService.delete('fav_cookie');
        cookieService.set('fav_cookie', 'haunter');
        leftPanel.favPkmnsArray = ['haunter']; // Set left panel favourite list

        // Removing pokémon non in cookie
        expect(app.removeFavPkmn('wrong_pkmn')).toEqual(false);
        expect(leftPanel.favPkmnsArray.includes('haunter')).toEqual(true);

        // Removing correct pokémon
        expect(app.removeFavPkmn('haunter')).toEqual(true);
        expect(app.isFavPkmn).toEqual(false);
        expect(leftPanel.favPkmnsArray.includes('haunter')).toEqual(false);

  });

});