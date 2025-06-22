import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BASIC_ANIMATIONS } from '../../../constant/constant';


@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  animations: [
    BASIC_ANIMATIONS
  ],
})
export class LoadingComponent {

  @Input() loading = false;

  @Output() loadingChange = new EventEmitter<boolean>();
}
