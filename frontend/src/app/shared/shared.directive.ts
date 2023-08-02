import { Directive, ElementRef, Renderer2, Input, SimpleChanges, HostBinding, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

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
    return this.status === "complete" ? '&#10003;' : '';
  }

  @HostBinding('class.complete')
  get isComplete(): boolean {
    return this.status === "complete";
  }

}
@Directive({
  selector: '[appFormatNumber]'
})
export class FormatNumberDirective implements OnInit{
  constructor(
    private control: NgControl
  ) {}

  ngOnInit() {
    const value = this.control.control?.value
    this.control.control?.setValue(this.formatValue(value), { emitEvent: false });
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    this.control.control?.setValue(this.parseValue(value), { emitEvent: false });
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    this.control.control?.setValue(this.formatValue(this.parseValue(value)), { emitEvent: false });
  }

  parseValue(value: string | undefined | null): number | null{
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return parseFloat(value.replace(/,/g, ''));
  }

  formatValue(value: number | null): string {
    if (value === undefined || value === null) {
      return '';
    }

    return value.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
