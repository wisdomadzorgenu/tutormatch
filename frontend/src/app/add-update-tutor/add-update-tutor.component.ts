import { Component, OnInit,ViewChild } from '@angular/core';
import {NgForm} from "@angular/forms";
import { BackendHttpOperationsService } from '../services/backend-http-operations.service';
import { ActivatedRoute, Data, Router } from '@angular/router';

@Component({
  selector: 'app-add-update-tutor',
  templateUrl: './add-update-tutor.component.html',
  styleUrls: [
    './add-update-tutor.component.css',
    '../tutor-information/tutor-information.component.css'
  ]
})
export class AddUpdateTutorComponent implements OnInit {
	@ViewChild("form",{static:false}) form:NgForm;
  public tutorName:string = null;
  public tutorID:string = null;
  public isSubmitBtnClicked:boolean = false;

  //alert component variables
  public showAlert:boolean = false;
  public alertType:string = "";
  public alertMessage:string = "";

  constructor(private backendOp:BackendHttpOperationsService,
              private router:Router, private route:ActivatedRoute) {
  }

  //on initialized
  ngOnInit(): void {
		//process query parameters
		this.route.queryParams.subscribe((data:Data)=>{
      //retrieve id, if possible from query string
      this.tutorID = data.id ? data.id : null;

      if(this.tutorID)
      {
        //fetch tutor information from backend
        this.backendOp.getTutorInformation(this.tutorID)
          .subscribe((response:any)=>{

            //show any error information
            if(response && response.error){
              this.alertType = "error";
              this.alertMessage = response.message;
              this.showAlert = true;
            }
            else if(response && Array.isArray(response.tutorInformation) &&
              response.tutorInformation.length > 0){
              //assign the tutor name as well
              this.tutorName = response.tutorInformation[0].tutorName;
            }
          });
      }
    });
  }

  public submitForm()
  {
    this.isSubmitBtnClicked = true;

    //only valid forms should pass
    if(this.form.valid)
    {
      //update tutor information if id exists
      if(this.tutorID){

        let form = {tutorID:this.tutorID,tutorName:this.tutorName};

        //update existing tutor information
        this.backendOp.updateTutor(form)
          .subscribe((response:any)=>{
            //process response
            this.processServerFormResponse(response,"update");
          });
      }
      else {

        let form = {name:this.tutorName};

        //create new tutor info
        this.backendOp.createNewTutor(form)
          .subscribe((response:any)=>{
            //process response
            this.processServerFormResponse(response,"create");
          });
      }
    }//validation
  }

  //process server response form submitted form
  private processServerFormResponse(response:any,caller:string){
    //by default message is error
    this.alertType = "error";

    if((caller === "update" && response.isUpdated) ||
       (caller === "create" && response.isSaved)){
      this.alertType = "okay";

      //fetch saved tutor's id
      this.tutorID = response.isSaved ? response.tutorID : this.tutorID;
    }

    //set message and show
    this.alertMessage = response.message;
    this.showAlert = true;

    //redirect to home after 3s
    if(this.alertType == "okay"){
      setTimeout(()=>{
        this.router.navigate(['/'])
      },3000);
    }
  }

  public onAlertClosed(closed:boolean){
    if(closed)
      this.showAlert = false;
  }
}
