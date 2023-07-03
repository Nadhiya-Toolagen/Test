import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/services/authentication.service';
import { Router, ActivatedRoute, Params }     from '@angular/router';
import {environment} from 'environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthenticationService],
})
export class LoginComponent implements OnInit {

  constructor(
    private authenticationService : AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router : Router
  ) { }

  ngOnInit() {
    //window.location.reload();
    // this.activatedRoute.queryParams.subscribe((params: Params) => {
    //   localStorage.removeItem('currentUser');
    //   let token = params['token'];
    //   let key = params['key'];
    //   if(token && key){
    //     localStorage.setItem('currentUser', JSON.stringify({ username: key, token: token }));
    //     this.router.navigate(['/base']);
    //   }
    // });
    // Retrieve the token and key from the cookie
    const token =  decodeURIComponent(this.getCookieValue('token'));
    const key =decodeURIComponent(this.getCookieValue('key'));
 if(token && key)
 {
    localStorage.setItem('currentUser', JSON.stringify({ username: key, token: token }));
    this.removeCookie('token');
    this.removeCookie('key');
    this.router.navigate(['/']);
 }

    // Remove the cookie after retrieving the values

  }

  // ngAfterViewInit(){
  //   window.location.reload();
  // }
  
 // Helper function to retrieve a cookie value by name
 getCookieValue(name: string): string {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  if(cookies)
  {
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
}
  return '';

}

// Helper function to remove a cookie by name
removeCookie(name: string) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
  login() {
    window.open(environment.origin + '/auth/login', "_self");
  }
}
