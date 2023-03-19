import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-edit',
    template:`
            <div class="d-grid gap-1 mx-auto h-100 w-100">
                <button class="btn border-0 p-0" type="button" (click)="onOpenModal()">
                    <img src="{{pen}}" alt="" class="mx-auto d-block">
                </button>
            </div>
            `,
    styles:[
        'img {width: 60%;}',
        'button {height: 25px; width: 25px}',
        'button:hover {border-radius: 50%; background-color: rgba(217,217,217, 1)}'
    ]
})
export class EditComponent {
    pen = "assets/images/pen.svg";
    @Output() onOpenModalEdit = new EventEmitter<void>();

    onOpenModal(){
        this.onOpenModalEdit.emit()
    }
}