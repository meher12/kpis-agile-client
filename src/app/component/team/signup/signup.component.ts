import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
//import { AuthService } from '../services/auth.service';
import { AuthService } from '../../../services/team/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoggedIn = false;
  showScrumMBoard = false;
  roles: string[] = [];

  form: any = {
    username: null,
    email: null,
    password: null
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  imageSrc = ""  
  imageAlt = ""

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.imageSrc = '../assets/images/logo.png'  
    this.imageAlt = 'Agile KPIs'

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showScrumMBoard = this.roles.includes('ROLE_SCRUMMASTER');

    
    }
  }

  onSubmit() {
    const { username, email, password } = this.form;
    this.authService.register(username, email,  password)
      .subscribe(data => {
        console.log(data),
          this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
        err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;

        });
  }

}