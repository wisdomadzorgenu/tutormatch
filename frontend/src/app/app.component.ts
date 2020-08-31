import { Component } from '@angular/core';
import { PageTitleHandlerService } from './services/page-title-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //page title hander initialzed here to automatically set page titles
  constructor(private pageTitleHandler:PageTitleHandlerService){}
}
