import { Component, OnInit,OnChanges, Input,Output,EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-alert-information',
  templateUrl: './alert-information.component.html',
  styleUrls: ['./alert-information.component.css']
})
export class AlertInformationComponent implements OnInit, OnChanges {

  @Input() message:string;
  @Input() messageType:string;
  @Output() onClosed = new EventEmitter<boolean>();

  public alertTimeout:number = 10000;
  public alertType:string = "success";

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(change:SimpleChanges){
    //for info and error alerts, dismissible should be off(manually dismissed)
    if(change.messageType && change.messageType.currentValue){
      if(change.messageType.currentValue === "okay"){
        this.alertType = "success";
        this.alertTimeout = 10000; //10s
      }

      if(change.messageType.currentValue === "error"){
        this.alertType = "danger";
        this.alertTimeout = undefined;
      }
    }
  }

  //closing success alert should reset the isSuccessful Property
  onAlertClosed(){
    //emit event
    this.onClosed.emit(true);
  }

}
