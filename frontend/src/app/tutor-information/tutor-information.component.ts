import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { BackendHttpOperationsService } from '../services/backend-http-operations.service';

@Component({
  selector: 'app-tutor-information',
  templateUrl: './tutor-information.component.html',
  styleUrls: ['./tutor-information.component.css']
})
export class TutorInformationComponent implements OnInit {
  public tutorInformation:{tutorName:string,tutorID:string}[] = [];

  //alert component variables
  public showAlert:boolean = false;
  public alertType:string = "";
  public alertMessage:string = "";

  constructor(private backendOp:BackendHttpOperationsService, private route:ActivatedRoute) { }

  ngOnInit() {
    //subscribe to data changes
		this.route.data.subscribe(
			(data:Data)=>{
        let response = data["tutorInfo"];

        //show any error information
        if(response && response.error){
          this.alertType = "error";
          this.alertMessage = response.message;
          this.showAlert = true;
        }
        else {
          //retrieve tutor information
          this.tutorInformation = (response && response.tutorInformation) ? response.tutorInformation : [];
        }
			});
  }

  public deleteTutor(tutorID:string,tutorName:string,index:number){
    let confirmMessage = "Are you sure you want to delete " + tutorName + " ?";
    confirmMessage += " Operation will be irreversible.";

    let confirmed = window.confirm(confirmMessage);

    if(confirmed){
      let form = {tutorID:tutorID};

      //delete tutor from server
      this.backendOp.deleteTutor(form)
        .subscribe((response:any)=>{

          //default error type is error
          this.alertType = "error";

          //if response is valid
          if(response && response.isDeleted){
            this.alertType = "okay";

            //remove deleted field from array
            this.tutorInformation.splice(index,1);
          }

          //assign message type and show alert.
          this.alertMessage = response.message;
          this.showAlert = true;
        });
    }
  }

  public onAlertClosed(closed:boolean){
    if(closed)
      this.showAlert = false;
  }
}
