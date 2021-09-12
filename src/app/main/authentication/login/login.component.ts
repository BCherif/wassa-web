import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {AuthBody} from '../../../utils/auth-body';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    authBody: AuthBody;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param router
     * @param authService
     * @param toastr
     * @param _spinnerService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private toastr: ToastrService,
        private _spinnerService: NgxSpinnerService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        document.title = 'WASSA | Authentification';

        localStorage.removeItem('app-token');
        localStorage.removeItem('isLoggedin');
        this.authBody = new AuthBody();

        this.loginForm = this._formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onLogin(): void {
        this._spinnerService.show();

        this.authBody.username = this.loginForm.value.username;
        this.authBody.password = this.loginForm.value.password;
        this.authService.login(this.authBody).subscribe(ret => {
            if (ret['ok'] === true) {
                this.toastr.success(ret['message']);
                localStorage.setItem('app-token', btoa(unescape(encodeURIComponent(JSON.stringify(ret['data'])))));
                localStorage.setItem('isLoggedin', 'true');

                this.router.navigateByUrl('/main/wassa-management/nature-request').then(r => {
                    if (r) {
                        this._spinnerService.hide();
                    } else {
                        this._spinnerService.hide();
                        console.log('La navigation a échoué!');
                    }
                });
            } else {
                this._spinnerService.hide();
                this.toastr.error(ret['message']);
            }

        }, e => {
            this._spinnerService.hide();
            this.toastr.error(environment.errorMessage);
        });

    }
}
