import { Directive, ElementRef, Renderer2, Input, SimpleChanges, HostListener, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appDot]'
})
export class DotDirective {
  @Input() status = "";
  statusColor: {[key: string]: string} = {
    active: "rgb(15, 86, 179)",
    inactive: "white",
    complete: "rgb(182,218,182)"
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // this.el.nativeElement.style.backgroundColor = this.color;
    this.el.nativeElement.style.borderRadius = '50%';
    this.el.nativeElement.style.width = '1.2em';
    this.el.nativeElement.style.height = '1.2em';
    this.el.nativeElement.style.display = 'inline-block';
    this.el.nativeElement.style.border = '1px solid rgba(0, 0, 0, 0.25)';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['status']) {
      this.el.nativeElement.style.backgroundColor = this.statusColor[this.status];
    }
  }
}