import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-required',
    template:`
            <img src="{{red_star}}" class="rounded" alt="">
            <span class="p-1 text-grey font-small fw-light">required</span> 
             `,
    styles: [
        '.text-grey { color: rgba(128,128,128,1) }',
        '.font-small { font-size: 0.75em}',
        'img {width: 4%}'
    ]
})
export class RequiredComponent implements OnInit{
    red_star = "assets/images/red_star.svg";

    ngOnInit(): void {}
}