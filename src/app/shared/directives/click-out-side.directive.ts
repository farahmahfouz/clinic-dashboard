import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutSide]',
  standalone: true
})
export class ClickOutSideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  
  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event'])

  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
