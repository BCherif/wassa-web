import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {AuthBody} from './auth-body';
import {User} from '../data/models/user.model';

@Injectable()
export class TuwindiUtils {
    constructor() {
    }

    httpHeaders() {
        const token: string = this.getToken();
        let headers = new HttpHeaders();
        if (token) { // token is present
            headers = headers.set('authorization', 'Bearer ' + token);
        }
        return {
            headers: headers
        };
    }

    uploadOption() {
        const token: string = this.getToken();
        let _headers = new HttpHeaders();
        if (token) {
            _headers = _headers.set('enctype', 'multipart/form-data');
            _headers = _headers.set('authorization', 'Bearer ' + token);
        }
        // let _headers = new HttpHeaders({
        //     enctype: 'multipart/form-data',
        //     Authorization: `${token}`
        // });
        return {headers: _headers};
    }

    getToken(): string {
        let authBody: AuthBody = this.getAuthBody();
        if (authBody) {
            return authBody.token;
        } else {
            return null;
        }
    }

    getAppUser(): User {
        let authBody: AuthBody = this.getAuthBody();
        if (authBody) {
            return authBody.user;
        } else {
            return null;
        }
    }

    getAuthBody(): AuthBody {
        if (!localStorage.getItem('app-token')) {
            return null;
        } else {
            return JSON.parse(atob(localStorage.getItem('app-token')));
        }
    }
}