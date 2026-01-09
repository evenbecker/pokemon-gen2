import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ng2-cookies';
import { ToastrModule } from 'ngx-toastr';
import { Settings } from '../../settings/settings';
import { RightPanelComponent } from '../rightPanel/rightpanel.component';
import { RightPanelTopBarComponent } from '../rightPanel/rightPanelTopBar/rightpaneltopbar.component';
import { HttpService } from '../services/httpService';
import { PanelService } from '../services/panelService';
import { SettingsService } from '../services/settingsService';
import { LeftPanelComponent } from './leftpanel.component';

describe('LeftPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeftPanelComponent, RightPanelComponent, RightPanelTopBarComponent],
      imports: [HttpClientModule, ToastrModule.forRoot()],
      providers: [HttpService, CookieService, PanelService, SettingsService],
    }).compileComponents();
  });

  // Init component
  function initComponent() {
    const fixture = TestBed.createComponent(LeftPanelComponent);
    return fixture.componentInstance;
  }

  it('LeftPanel get settings data from mocked cookie', () => {
    // Mock variables
    const fake_cookie = '{"nbPkmnByPage": 10, "isDarkTheme": true}'; // Not the default settings
    let cookieService: CookieService = new CookieService();
    cookieService.set('settings_cookie', fake_cookie);

    const app = initComponent();
    app.getSettingsData();
    cookieService.delete('settings_cookie');

    // Data to match
    let toMatch: Settings = new Settings(10, true);

    // Data checks
    expect(app.settingsDict).toEqual(toMatch);
  });

  it('LeftPanel no cookie available for settings data', () => {
    // Create component and access it
    const app = initComponent();
    const cookieService: CookieService = new CookieService();
    cookieService.delete('settings_cookie');

    app.getSettingsData();

    // Data to match with default values
    let toMatch: Settings = new Settings(20, false);

    // Data checks
    expect(app.settingsDict).toEqual(toMatch);
  });

  it('change pkmn to display on the right panel from click on the left', () => {
    const app = initComponent();
    const rightPanel = TestBed.createComponent(RightPanelComponent).componentInstance;

    expect(rightPanel.pkmnName).toEqual(''); // Main page
    app.sendPkmnToShow('haunter');
    expect(rightPanel.pkmnName).toEqual('haunter');
  });

  it('set new favourite pkmn and check if right panel is updated', () => {
    const app = initComponent();
    const rightPanel = TestBed.createComponent(RightPanelComponent).componentInstance;

    app.favPkmnsArray = [];
    expect(app.favPkmnsArray).toEqual([]);
    app.setNewFavPkmn('haunter');
    expect(app.favPkmnsArray).toEqual(['haunter']);
  });

  it('remove favourite pokémon', () => {
    const app = initComponent();

    // If array is empty
    app.favPkmnsArray = [];
    expect(app.removeFavPkmn('haunter')).toEqual(false);
    // If array is not empty but wrong pokémon
    app.favPkmnsArray = ['haunter'];
    expect(app.removeFavPkmn('wrong_pkmn')).toEqual(false);
    // If array is not empty and pokémon is in array
    expect(app.removeFavPkmn('haunter')).toEqual(true);
  });

  it('delete fav pkmn list', () => {
    const app = initComponent();
    const cookieService: CookieService = new CookieService();
    cookieService.delete('fav_cookie');

    // Empty array
    app.favPkmnsArray = [];
    app.deleteFavPkmnList();
    expect(app.favPkmnsArray).toEqual([]);
    expect(cookieService.check('fav_cookie')).toEqual(false);

    // Not empty array
    app.favPkmnsArray = ['gastly', 'haunter', 'gengar'];
    cookieService.set('fav_cookie', app.favPkmnsArray.toString());
    app.deleteFavPkmnList();
    expect(app.favPkmnsArray).toEqual([]);
    expect(cookieService.check('fav_cookie')).toEqual(false);
  });

  it('moving between list pages', () => {
    const app = initComponent();

    // nbPkmnByPage is default so 20

    app.page = 1;
    // The next page button is active if the get gives us a "next page" url
    app.urls.nextArrayPage = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20';

    // Going previous page but it already at page 1
    expect(app.prevPage()).toEqual(false);
    // Going next page while at page 1
    expect(app.nextPage()).toEqual(true);
    // Going back to page 1 while at page 2
    expect(app.prevPage()).toEqual(true);
    // Go to page
    // Need to check if it goes too far
    // For tests purpose, let's say there are 1000 pkmns
    app.nbPkmn = 251;
    expect(app.goToPage(1)).toEqual(true);
    expect(app.goToPage(99999)).toEqual(false);
  });

  it('change list page', () => {
    const app = initComponent();

    expect(app.isFavListPage).toEqual(false);
    app.favListPage();
    expect(app.isFavListPage).toEqual(true);
  });
});
