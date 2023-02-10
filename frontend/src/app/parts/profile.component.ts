import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, mergeMap, Subscription } from 'rxjs';
import { Firm } from '../pages/auth/firm';
import { User } from '../pages/auth/user';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-profile',
  template: `
        <div class="modal" tabindex="-1" [ngStyle]="{'display':displayStyle}" role="dialog">
        <div class="modal-dialog modal-centered">
            <div class="modal-content">

                <div class="modal-header">
                  <h5 class="modal-title w-100 text-center">Profile</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" (click)="closePopup()"></button>
                </div>

                <div class="modal-body d-flex align-items-center">
                  <ng-container *ngIf="!isEdit">
                    <div class="mx-auto text-center">
                      <p class="fw-bold">{{user.firstName}} {{user.lastName}}</p>
                      <p>{{user.email}}</p>
                    </div>
                  </ng-container>
                  
                  <ng-container *ngIf="isEdit">
                    <form [formGroup]="form" #f="ngForm" class="mx-auto">
                      <div class="form-group mb-4">
                        <div class="form-floating">
                          <input type="text" class="form-control" id="first-name"
                                formControlName="firstName"
                                name="firstName"
                                placeholder="First name">
                          <label for="first-name">First name</label>
                        </div>
                      </div>

                      <div class="form-group mb-2">
                        <div class="form-floating">
                          <input type="text" class="form-control" id="last-name"
                                formControlName="lastName"
                                name="lastName"
                                placeholder="Last name">
                          <label for="last-name">Last name</label>
                        </div>
                      </div>

                      <div class="form-group mb-2">
                      <app-required></app-required>
                        <div class="form-floating">
                          <input type="text" class="form-control" id="email"
                                formControlName="email"
                                name="email"
                                placeholder="Email">
                          <label for="email">Email</label>
                        </div>
                      </div>
                      <div *ngIf="(email?.invalid && (email?.dirty || email?.touched)) || (f.submitted && email?.invalid)"
                          class="alert alert-danger">
                          Please enter your email
                      </div>

                      <div class="form-group mb-2">
                      <app-required></app-required>
                        <div class="form-floating">
                          <input type="text" class="form-control" id="firm-name"
                                formControlName="firmName"
                                name="firmName"
                                placeholder="Firm name">
                          <label for="firm-name">Firm name</label>
                        </div>
                      </div>
                      <div *ngIf="(firmName?.invalid && (firmName?.dirty || firmName?.touched)) || (f.submitted && firmName?.invalid)"
                          class="alert alert-danger">
                          Please enter the name of your firm
                      </div>

                      <div *ngFor="let error of errors " class="alert alert-danger text-center"> 
                          {{error}}
                      </div>
                    </form>

                  </ng-container>

                </div>

                <div class="modal-footer" [ngClass]="{'justify-content-between': !isEdit}">
                  <ng-container *ngIf="!isEdit">
                      <button type="button" class="btn btn-primary m-2" (click)="onEdit()">Edit</button>
                      <button type="button" class="btn btn-danger m-2" (click)="onLogout()">Logout</button>
                  </ng-container>
                  <ng-container *ngIf="isEdit">
                      <button type="button" class="btn btn-secondary m-2" (click)="isEdit=false">Cancel</button>
                      <button type="submit" class="btn btn-success m-2" (click)="onUpdate()">Save</button>
                  </ng-container>

                </div>
            </div>
        </div>
      </div>
    `,
  styles: [
    '.modal {background-color: rgba(0, 0, 0, 0.7);}',
    '.modal-centered {top: 10em}',

  ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  displayStyle = "block";
  isEdit = false;

  sub = Subscription.EMPTY;
  errors: string[] = new Array();
  user = {} as User;
  @Output() onClosePopup = new EventEmitter<void>();

  form: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: ['', Validators.required],
    firmName: ['', Validators.required]
  })
  get email() {
    return this.form.get('email')
  }
  get firstName() {
    return this.form.get('firstName')
  }
  get lastName() {
    return this.form.get('lastName')
  }
  get firmName() {
    return this.form.get('firmName')
  }

  constructor(
    private el: ElementRef,
    private _authService: AuthService,
    private fb: FormBuilder
  ) {
    this.addEventBackgroundClose();
  }

  ngOnInit(): void {
    this.initialiseForm();

    this.sub = this._authService.getUserSub()
      .subscribe(user => {
        this.user = user;
      })
  }

  initialiseForm() {
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email
    })

    if (!!this.user.firm) {
      this.form.patchValue({
        firmName: this.user.firm!.name
      })
    }
  }

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.closePopup();
      }
    });
  }

  onEdit() {
    this.isEdit = true;
    this.initialiseForm()
  }

  closePopup() {
    this.displayStyle = "none";
    this.onClosePopup.emit();
  }

  onLogout() {
    this._authService.logout();
  }

  onUpdate() {
    if (this.form.valid) {
      this.user.firstName = this.firstName?.value;
      this.user.lastName = this.lastName?.value;
      this.user.email = this.email?.value;

      let firm: Firm = this.user.firm;
      firm.name = this.firmName?.value;

      // ensure user update is propagted to home page
      this._authService.updateFirm(firm)
        .pipe(
          map(firm => {
            return firm
          }),
          mergeMap(firm => {
            this.user.firm = firm
            return this._authService.updateUser(this.user);
          })
        )
        .subscribe(userResponse => {
          this._authService.setUserSub(userResponse);
          this.isEdit = false;
        })
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}