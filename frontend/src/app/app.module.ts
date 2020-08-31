import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

//components
import { AppComponent } from './app.component';
import { AlertInformationComponent } from './alert-information/alert-information.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AddUpdateTutorComponent } from './add-update-tutor/add-update-tutor.component';
import { TutorInformationComponent } from './tutor-information/tutor-information.component';

//services
import {TutorInfoResolverService} from "./services/tutor-info-resolver.service";

//modules
import { AppRoutingModule } from './app-routing.module';
import {CoreModule} from "./core.module";
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [
    AppComponent,
    AlertInformationComponent,
    TutorInformationComponent,
    NotFoundPageComponent,
    AddUpdateTutorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AlertModule.forRoot(),
    AppRoutingModule,
    CoreModule
  ],
  providers: [TutorInfoResolverService],
  bootstrap: [AppComponent]
})
export class AppModule { }
