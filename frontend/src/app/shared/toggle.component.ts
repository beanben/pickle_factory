import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-toggle-button',
    template:`
            <div class="d-flex justify-content-center align-items-center">
                <button type="button" class="btn d-flex justify-content-center align-items-center" (click)="toggle = !toggle">
                        <span class="mx-auto">{{toggle ? '+' : '-'}}</span>
                </button>
            </div>
            `,
    styles:[
        'button {height: 25px; width: 25px}',
        'button:hover {border-radius: 50%; background-color: rgba(217,217,217, 1); border: 0.15px solid grey}',
    ]
})
export class ToggleComponent {
    @Input() toggle = false;
    // @Output() toggleChange = new EventEmitter<void>();

    // onOpenModal(){
    //     // this.onOpenModalEdit.emit()
    // }
}