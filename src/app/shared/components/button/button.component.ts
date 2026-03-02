import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';

  @HostBinding('class')
  get buttonClasses(): string {
    const base =
      'cursor-pointer transition text-center text-sm';

    const variants = {
      primary: 'px-4 py-2 rounded-lg bg-primary font-medium transition text-white',
      secondary: 'px-4 py-2 rounded-lg border font-medium transition text-black',
      danger:  'px-6 py-3 text-sm bg-danger rounded-lg text-white'
    }

    return `${base} ${variants[this.variant]}`;
  }
}
