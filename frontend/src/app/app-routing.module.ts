import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { TutorInformationComponent } from './tutor-information/tutor-information.component';
import { AddUpdateTutorComponent } from './add-update-tutor/add-update-tutor.component';

//services
import {TutorInfoResolverService} from "./services/tutor-info-resolver.service";

const routes: Routes = [
  {
    path:'',component:TutorInformationComponent,data:{title:"Tutor Management System"},
    resolve:{tutorInfo:TutorInfoResolverService}
  },
  {path:'change',component:AddUpdateTutorComponent,data:{title:"Create|Update tutor information"}},
  { path: '**', redirectTo:'/', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
