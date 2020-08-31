import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams} from '@angular/common/http';

@Injectable()
export class BackendHttpOperationsService {
  serverDomain = 'http://localhost:5500';

  constructor(private  http: HttpClient){}

  //get all tutor information
  public getTutorInformation(tutorID:string=null){
    let params = {};

    if(tutorID){
      //add query params to request
      params = new HttpParams().set('tutorID',tutorID);
    }

    //fetch all tutors optionally retrieving a single tutor
		return this.http.get(this.serverDomain + '/tutors',{params:params});
  }

  //create a new tutor
  public createNewTutor(form){
    //set headers
    let headers = new HttpHeaders({'Content-Type':'application/json'});

    //submit request
		return this.http.post(this.serverDomain+'/create-tutor',form,{headers:headers});
  }

  //update tutor information
  public updateTutor(form){
   //set headers
   let headers = new HttpHeaders({'Content-Type':'application/json'});

   //submit request
   return this.http.post(this.serverDomain+'/update-tutor',form,{headers:headers});
  }

  public deleteTutor(form){
   //set headers
   let headers = new HttpHeaders({'Content-Type':'application/json'});

   //submit request
   return this.http.post(this.serverDomain+'/delete-tutor',form,{headers:headers});
  }
}
