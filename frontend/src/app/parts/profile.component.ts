import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map, mergeMap, mergeMapTo } from 'rxjs';
import { Firm } from '../pages/auth/firm';
import { User } from '../pages/auth/user';
import { AuthService } from '../_services/auth/auth.service';

@Component({
    selector: 'app-profile',
    template:`
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
                      <p class="fw-bold">{{user.first_name}} {{user.last_name}}</p>
                      <p>{{user.email}}</p>
                    </div>
                  </ng-container>
                  
                  <ng-container *ngIf="isEdit">
                    <form [formGroup]="form" #f="ngForm" class="mx-auto">
                      <div class="form-group mb-4">
                        <div class="form-floating">
                          <input type="text" class="form-control" id="first_name"
                                formControlName="first_name"
                                name="first_name"
                                placeholder="First name">
                          <label for="first_name">First name</label>
                        </div>
                      </div>

                      <div class="form-group mb-2">
                        <div class="form-floating">
                          <input type="text" class="form-control" id="last_name"
                                formControlName="last_name"
                                name="last_name"
                                placeholder="Last name">
                          <label for="last_name">Last name</label>
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
                          <input type="text" class="form-control" id="firm_name"
                                formControlName="firm_name"
                                name="firm_name"
                                placeholder="Firm name">
                          <label for="firm_name">Firm name</label>
                        </div>
                      </div>
                      <div *ngIf="(firm_name?.invalid && (firm_name?.dirty || firm_name?.touched)) || (f.submitted && firm_name?.invalid)"
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
export class ProfileComponent implements OnInit{
    displayStyle = "block";
    @Output() onClosePopup = new EventEmitter<void>();
    @Input() user = {} as User;
    errors: string[] = new Array();
    isEdit = false;
    form: FormGroup = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: ['', Validators.required],
      firm_name: ['', Validators.required]
    })
    get email(){
      return this.form.get('email')
    }
    get first_name(){
      return this.form.get('first_name')
    }
    get last_name(){
      return this.form.get('last_name')
    }
    get firm_name(){
      return this.form.get('firm_name')
    }

    constructor(
        private el: ElementRef,
        private _authService: AuthService,
        private fb: FormBuilder
      ) { 
        this.addEventBackgroundClose();
      }
      
      ngOnInit(): void {
        this.initialiseForm()
      }

      initialiseForm(){
        this.form.patchValue({
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          email: this.user.email
        })

        if(!!this.user.firm){
          this.form.patchValue({
            firm_name: this.user.firm!.name
          })
        }
      }
      
      addEventBackgroundClose(){
        this.el.nativeElement.addEventListener('click', (el:any) => {
          if (el.target.className === 'modal') {
              this.closePopup();
          }
        });
      }

      onEdit(){
        this.isEdit = true;
        this.initialiseForm()
      }

      closePopup() {
          this.displayStyle = "none"; 
          this.onClosePopup.emit();
      }

      onLogout(){
        this._authService.logout();
      }

      onUpdate(){
        if(this.form.valid){
          this.user.first_name = this.first_name?.value;
          this.user.last_name = this.last_name?.value;
          this.user.email = this.email?.value;

          let firm: Firm = this.user.firm;
          firm.name = this.firm_name?.value;

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
              this._authService.changeUserSub(userResponse);
              this.isEdit = false;
            })

        }
      }


}