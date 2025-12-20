import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from 'express';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class CrudserviceService {
  apiRoot: string;
  url: any;
  
  constructor( private http: HttpClient, @Inject(DOCUMENT) private document: Document ) {
    this.apiRoot = typeof environment.apiRoot === 'function' ? environment.apiRoot() : environment.apiRoot;
  }

  private getToken(): string {
    const localStorage = this.document.defaultView?.localStorage;
    const token = localStorage?.getItem('token');
    return token ? JSON.parse(token) : '';
  }

  getAllUser(){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.http.get(this.apiRoot + 'user/', { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
  }));
  }
  adduser(edata:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    if(edata._id){
      return this.http.post(this.apiRoot + 'user/update', edata, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
      }));
    }
    else{
    return this.http.post(this.apiRoot + 'user/create', edata, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
  }));
    }
  
  }
  getAllPlan(){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.http.get(this.apiRoot + 'plan/', { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
  }));
  }
  
  addplan(edata:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    if(edata._id){
      return this.http.post(this.apiRoot + 'plan/update', edata, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
      }));
    }
    else{
    return this.http.post(this.apiRoot + 'plan/create', edata, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
  }));
    }
  
  }
  deleteplan(edata:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
      return this.http.post(this.apiRoot + 'plan/delete?id='+edata._id, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
      }));
  }

  getAllCoupon(){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.http.get(this.apiRoot + 'coupon/', { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
  }));
  }
  deletebyId(edata:any,collectionName:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
      return this.http.get(this.apiRoot + collectionName+'/delete?id='+edata._id, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
      }));
  }
  addcoupon(edata:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    if(edata._id){
      return this.http.post(this.apiRoot + 'coupon/update', edata, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
      }));
    }
    else{
    return this.http.post(this.apiRoot + 'coupon/create', edata, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
  }));
    }
  
  }

  getDetailsById(collectionName:any,Id:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
      return this.http.get(this.apiRoot + collectionName+'/findparticular?id='+Id, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
      }));
  }
  addData(collectionName:any,edata:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    if(edata._id){
      return this.http.post(this.apiRoot + collectionName+'/update', edata, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
      }));
    }
    else{
    return this.http.post(this.apiRoot + collectionName+'/create', edata, { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
  }));
    }
  
  }

  createDirectOrder(edata:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.http.post(this.apiRoot + 'razorpay/create-direct-order', edata, { headers }).pipe( tap(() => {}, (err: any) => {
      this.errorHandler(err)
    }));
  
  }
  
  deactivateDirectOrder(edata:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.http.post(this.apiRoot + 'razorpay/deactivate-order', edata, { headers }).pipe( tap(() => {}, (err: any) => {
      this.errorHandler(err)
    }));
  
  }

  successDirectOrder(edata:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.http.post(this.apiRoot + 'razorpay/success', edata, { headers }).pipe( tap(() => {}, (err: any) => {
      this.errorHandler(err)
    }));
  
  }
  
  getAllData(collectionName:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.http.get(this.apiRoot + collectionName+'/', { headers }).pipe( tap(() => {}, (err: any) => {
        this.errorHandler(err)
  }));
  }

  applyCoupon(body:any){
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.http.post(this.apiRoot +'coupon/apply-coupon',body, { headers }).pipe( tap(() => {}, (err: any) => {
      this.errorHandler(err)
}));
  }

  errorHandler(err: any) {
    throw new Error('Method not implemented.');
  }

}
