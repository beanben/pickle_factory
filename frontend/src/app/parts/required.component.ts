import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-required',
    template:`
            <img src="{{redStar}}" class="rounded" alt="">
            <span class="p-1 text-grey font-small fw-light">required</span> 
             `,
    styles: [
        '.text-grey { color: rgba(128,128,128,1) }',
        '.font-small { font-size: 10px}',
        'img {width: 10px}'
    ]
})
export class RequiredComponent implements OnInit{
    redStar = "assets/images/redStar.svg";

    ngOnInit(): void {}
}