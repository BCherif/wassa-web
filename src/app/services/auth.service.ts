import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {WassaUtils} from '../utils/wassa-utils';
import {AuthBody} from '../utils/auth-body';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    readonly serviceURL: string;
    readonly httpOptions: any;

    constructor(private http: HttpClient, private router: Router) {
        this.serviceURL = environment.serviceUrl;
        this.httpOptions = new WassaUtils().httpHeaders();
    }

    public login(authBody: AuthBody) {
        return this.http.post(this.serviceURL + '/login', authBody);
    }

    public updatePwd(authBody: AuthBody) {
        return this.http.post(this.serviceURL + '/update_pwd', authBody, this.httpOptions);
    }

    public resetPwd(authBody: AuthBody) {
        return this.http.post(this.serviceURL + '/resetPwd', authBody, this.httpOptions);
    }

    public isLoggedIn(userId: number, callback) {
        return this.http.get(this.serviceURL + '/auth/loggedIn/' + userId, this.httpOptions)
            .subscribe(ret => {
                callback(ret['response']);
            });
    }

    forceLogout() {
        localStorage.removeItem('isLoggedin');
        // localStorage.removeItem('app-user');
        this.router.navigate(['/login']);
    }

}