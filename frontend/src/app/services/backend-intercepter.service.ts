import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
	HttpErrorResponse
} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, of} from 'rxjs';
import { catchError, retry} from 'rxjs/operators';

@Injectable()
export class BackendIntercepterService implements HttpInterceptor {
	constructor(private router:Router) {

  }

	intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>
	{
		// intercepts the response on its way back to the application
		return next.handle(req)
			.pipe(
				retry(3), // retry a failed request up to 3 times
				catchError((error : HttpErrorResponse) =>{
					//return an identical response similar to an http server response
					//nothing will happen since error is not processed
          let response = {
            error:true,message:"Sorry, an error occurred on the server. Please try again later."
          };

					//return observable
					// return Observable.of(new HttpResponse({body: [{name: "Default value..."}]}));
					return of(new HttpResponse({body:response}));
				})
			);
	}
}
