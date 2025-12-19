import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { environment } from '../../../environment/environment';
import { CrudserviceService } from '../crud.service';
import {  ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss',
  providers: [  ConfirmationService]
})
export class CouponsComponent {
  @ViewChild('dialog') dialogElement: ElementRef | undefined;
  couponList: any;
  selectedCoupons: any;
  paginationvalue = environment.paginatorValue;
  searchvalue: any;
  cols: any;
  speedDial: boolean = false;
  visible: boolean = false;
  // ref: DynamicDialogRef | undefined;
  couponForm!: FormGroup<any>;
  BasicShow: boolean = false;
  currentcoupon: any;
  Form_name: any;
  visibleCouponDetails: boolean=false;
  selectedCoupon: any;
  minToDate: Date | undefined;
  showDiscountAmount = false;
  showDiscountPercentage = false;
  discountType: string | undefined;
  constructor(public crudService: CrudserviceService, private fb: FormBuilder, private datePipe: DatePipe,
    private confirmationService: ConfirmationService, private messageService: MessageService,private cdr: ChangeDetectorRef) {

    }

  ngOnInit() {
    this.couponForm = this.fb.group({
      couponName: ['', Validators.required],
      discountType: ['price'],
      discountAmount: ['',],
      discountPercentage: ['', ],
      from: ['', Validators.required],
      to: ['', Validators.required],
    });


    this.couponForm.get('discountType')?.valueChanges.subscribe(value => {
      this.discountType = value;
      // Manually trigger change detection
      this.cdr.detectChanges();
    });

    this.viewCouponData();
    this.cols = [
      { field: 'couponName', header: 'Coupon Name' },
      { field: 'from', header: 'Valid From' },
      { field: 'to', header: 'Valid UpTo' },
      { field: 'discountAmount', header: 'Discount Price' },
    ];  
  }
  showDialog() {
    this.BasicShow = true;
  }

  viewCouponData() {

    this.crudService.getAllCoupon().subscribe((data: any) => {
      console.log('this.couponList',data);
      this.couponList = data.statusCode.data.coupons;

    });
  }
  updateFieldsVisibility() {
    const discountType = this.couponForm.get('discountType')?.value;
    // this.showDiscountAmount = discountType === 'price';
    // this.showDiscountPercentage = discountType === 'percentage';
    if (discountType === 'price') {
      this.couponForm.get('discountPercentage')?.setValue('');
    }
    else if (discountType === 'percentage') {
      this.couponForm.get('discountAmount')?.setValue('');
    }
  }


  onDiscountTypeChange() {
    this.updateFieldsVisibility();
    setTimeout(() => {

    });
  }

  openNew() {
   this. Form_name = "Add Coupon"
    this.couponForm.setValue({
      couponName:null,
      from: null,
      to: null,
      discountAmount:null,
     discountPercentage:null,
      discountType :null
       
    });
    this.currentcoupon = null
    this.visible = true;
  }
  async viewDetails(coupon: any) {
    console.log('visible');
    this.selectedCoupon=coupon
    this.visibleCouponDetails = true;

  }
  // updateMinToDate() {
  //   this.couponForm.setValue({
  //     to: null,  
  //   });
  //   const fromDate = this.couponForm.get('from')?.value;
  //   if (fromDate) {
  //     this.minToDate = new Date(fromDate);
  //   } else {
  //     this.minToDate = undefined;
  //   }
  // }
  updateMinToDate() {
    const fromDate = this.couponForm.get('from')?.value;
    const toDate = this.couponForm.get('to');
  
    if (fromDate) {
      this.minToDate = new Date(fromDate);
  
      console.log('FromDate:', fromDate);
      console.log('ToDate:', toDate);
      console.log('MinToDate:', this.minToDate);
  
      // If the 'to' value is greater than the selected 'from' date, clear it
      if (toDate && toDate.value && toDate.value > this.minToDate) {
        console.log('Clearing to date');
        this.couponForm.patchValue({ to: null });
      }
    } else {
      this.minToDate = undefined;
    }
  }

  editSelectedCoupon(coupon: any) {
    this. Form_name = "Edit Coupon"
    this.visible = true;
    console.log("coupon",coupon);
    
    this.couponForm.setValue({
      couponName:coupon.couponName,
      from:coupon.from,
      to: coupon.to,
      discountAmount:coupon.discountAmount,
      discountPercentage:coupon.discountPercentage,
     discountType:coupon.discountType,
      
    });
    this.currentcoupon = coupon
  }


  deleteCoupon(coupon: any) {
    console.log("delete",coupon);
    
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Coupon',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // tslint:disable-next-line: prefer-for-of
        this.crudService.deletebyId(coupon,'coupon').subscribe((data: any) => {
          if (data.statusCode.success) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Coupon Deleted', life: 1000 });
            this.viewCouponData();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 1000 });
          }
        });
      }
    });

  }

  clear(table: Table) {
    table.clear();
    this.searchvalue = '';
  }
  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      
    }
  
    // Format the date using DatePipe
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }

  onSubmit(form:FormGroup) {
    console.log();
    var fromDate
    var  fromTo
    if (this.couponForm.valid) {

      if (typeof form.value.from === 'string') {
      fromDate =form.value.from    
      }
      else{
        let transformedDate = this.datePipe.transform(form.value.from, 'dd-MM-yyyy') || '';
        fromDate = transformedDate
        console.log("form.value.from",transformedDate);
      }
      if (typeof form.value.to === 'string') {
        fromTo =form.value.to
        console.log("fromTo",fromTo);
        }
        else{
          let transtoDate = this.datePipe.transform(form.value.to, 'dd-MM-yyyy') || '';
          fromTo = transtoDate
        console.log("form.value.to",transtoDate);
        }
      const edata: any = {
        couponName: form.value.couponName,
        from:fromDate, 
        to: fromTo,      
        discountAmount: form.value.discountAmount,
        discountPercentage: form.value.discountPercentage,
        discountType: form.value.discountType
      };
      console.log("this.currentcoupon",edata);
    
    if(this.currentcoupon){
      
      edata._id = this.currentcoupon._id
    }
    this.crudService.addcoupon(edata).subscribe((data: any) => {
      if (data.statusCode.success) {
        console.log("dataaaaa",data);
        
        this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Coupon Updated', life: 1000 });
        this.viewCouponData();
      } else {
        console.log("dataaaaa",data);
        this.visible = true;
        // this.mytable = false;
         this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 1000 });
      }
    });
      
      console.log('Form submitted:', this.couponForm.value);
    } else {
      // Form is invalid, mark all fields as touched to display error messages
      this.markFormGroupTouched(this.couponForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}