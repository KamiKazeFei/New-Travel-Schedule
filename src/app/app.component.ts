import { Component } from '@angular/core';
import { MainWidgetComponent } from './ui/component/main-widget/main-widget.component';

@Component({
  selector: 'app-root',
  imports: [
    MainWidgetComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'new-project';
}
