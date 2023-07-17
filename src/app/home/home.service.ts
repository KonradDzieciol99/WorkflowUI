import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseUrl = environment.apiUrl;
  //private socialApiUrl = environment.socialApiUrl;
  constructor(private http: HttpClient) { }


  // getWeather(){
  //   return this.http.get<any>(this.socialApiUrl + 'WeatherForecast');
  // }
}
