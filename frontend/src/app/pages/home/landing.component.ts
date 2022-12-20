import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-landing',
    template:`
            <div class="landing vh-100">
                <div class="container py-5">
                    <div class="row top-180">
                        <div class="col">
                            <h1 class="display-5 fw-bold">Manage all your loans<br> in one place.</h1>
                        <div>
                    <button class="btn btn-auth me-1 bg-light" type="button" routerLink="/auth/login">Login</button>
                    <button class="btn btn-auth ms-1 bg-light" type="button" routerLink="/auth/register">Register</button>
                </div> 
            </div>
            `,
    styles:[
        '.landing {background: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url("src/assets/images/landing_bg.png")  no-repeat center center fixed; background-size: cover;}',
        '.logo {background: url("src/assets/images/logo.svg") no-repeat;}',
        '.btn-auth {border: 2px solid #050537; background-color: white;}',
        '.btn {width: 132px; height: 48px; border-radius: 20px;}'
    ]
})
export class LandingComponent implements OnInit{
    ngOnInit(): void {}
}