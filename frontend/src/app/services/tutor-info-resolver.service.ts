import { Injectable } from '@angular/core';
import {Resolve,ActivatedRouteSnapshot,RouterStateSnapshot} from "@angular/router";
import { BackendHttpOperationsService } from './backend-http-operations.service';

@Injectable()
export class TutorInfoResolverService implements Resolve<any>{

  constructor(private backendOp:BackendHttpOperationsService) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		//fetch all tutor infos
		return this.backendOp.getTutorInformation();
	}
}
