import { Directive, ElementRef, Renderer2, Input, SimpleChanges, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDot]',
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

  @HostBinding('innerHTML')
  get innerHTML(): string {
    // const tick = '<span style="color:rgba(0, 128, 0, 1);">&#10003;</span>';
    // const tick = '<span style="color:red;">&#10003;</span>';
    return this.status === "complete" ? '&#10003;' : '';
  }

  @HostBinding('class.complete')
  get isComplete(): boolean {
    return this.status === "complete";
  }

}