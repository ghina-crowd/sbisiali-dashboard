import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import * as jwt_decode from 'jwt-decode';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(public jwtHelper: JwtHelperService) {
    }

    public isAuthenticated(): boolean {
        var email = localStorage.getItem('auth_sbisiali_admin') && localStorage.getItem('auth_sbisiali_admin') != 'undefined' ?  (jwt_decode(localStorage.getItem('auth_sbisiali_admin'))).sub : '';
        console.log(email);
        if(email) {
            return true;
        }
        return false;
    }
}
