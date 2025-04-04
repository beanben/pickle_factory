import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-landing',
    template:`
            <div class="landing vh-100">
                <div class="container p-2">
                    <img src="{{logoDark}}" alt="">
                    <span class="logo fw-bold fs-4 my-auto align-middle">Pickle</span>

                    <div class="row top-180 offset-1">
                        <div class="col">
                            <h1 class="display-5 fw-bold">Manage all your loans<br> in one place.</h1>
                            <button class="btn btn-auth me-1" type="button" routerLink="/auth/login">Login</button>
                            <button class="btn btn-auth ms-1" type="button" routerLink="/auth/register">Register</button>
                        </div>
                    </div>
                </div>
            </div>

            `,
    styleUrls: ['./home.component.css']

})
export class LandingComponent implements OnInit{
    logoDark = "assets/images/logoDark.svg";
    ngOnInit(): void {}
}