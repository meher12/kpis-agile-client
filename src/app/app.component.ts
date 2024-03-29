import { Component} from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

 
  private roles: string[] = [];
  isLoggedIn = false;
  showPOBoard = false;
  showScrumMBoard = false;
  showDevBoard = false;
  username?: string;
  imageSrc = ""  
  imageAlt = ""

  constructor(private tokenStorageService: TokenStorageService) {

   }


  ngOnInit(): void {
    //export class sample Component implements OnInit {
      this.imageSrc = '../assets/images/logo.png'  
      this.imageAlt = 'Agile KPIs'
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showPOBoard = this.roles.includes('ROLE_PRODUCTOWNER');
      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');
      this.showDevBoard = this.roles.includes('ROLE_DEVELOPER');

      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}