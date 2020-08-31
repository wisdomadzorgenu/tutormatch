import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {Title } from '@angular/platform-browser';

//servies
import {BackendIntercepterService} from "./services/backend-intercepter.service";
import {PageTitleHandlerService} from "./services/page-title-handler.service";
import { BackendHttpOperationsService } from './services/backend-http-operations.service';

//module should contain all relevant services and components or directives
//need by the entire app
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    Title,
    {provide: HTTP_INTERCEPTORS, useClass:BackendIntercepterService, multi: true},
    PageTitleHandlerService,
    BackendHttpOperationsService
  ]
})
export class CoreModule { }
