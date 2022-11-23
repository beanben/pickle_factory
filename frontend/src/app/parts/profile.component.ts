import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

                <div class="modal-body">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col">
                        <p class="text-center"></p>
                      
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                      {{user.email}}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <ng-container *ngIf="!isEdit">
                    <div class="row">
                      <div class="col d-flex flex-row">
                          <button type="button" class="btn btn-secondary m-2">Edit</button>
                          <button type="button" class="btn btn-primary m-2" (click)="onLogout()">Logout</button>
                      </div>
                    </div>
                  </ng-container>

                </div>
            </div>
        </div>
      </div>
    `,
    styles: [
        '.modal {background-color: rgba(0, 0, 0, 0.7);}',
        '.modal-centered {top: 10em}'
    ]
  })
export class ProfileComponent implements OnInit{
    displayStyle = "block";
    @Output() onClosePopup = new EventEmitter<void>();
    @Input() user = {} as User;
    isEdit = false;

    constructor(
        private el: ElementRef,
        private _authService: AuthService
      ) { 
        this.addEventBackgroundClose();
      }
    
      ngOnInit(): void {
      }
    
      addEventBackgroundClose(){
        this.el.nativeElement.addEventListener('click', (el:any) => {
          if (el.target.className === 'modal') {
              this.closePopup();
          }
        });
      }

    closePopup() {
        this.displayStyle = "none"; 
        this.onClosePopup.emit();
    }

    onLogout(){
      this._authService.logout();
    }


}