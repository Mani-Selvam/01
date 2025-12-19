import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
// import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../../environment/environment';
import { CrudserviceService } from '../crud.service';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [DatePipe]
})
export class UsersComponent implements OnInit {
  userList: any;
  paginationvalue = environment.paginatorValue;
  searchvalue: any;
 
  speedDial: boolean = false;
  visible: boolean = false;
  visibleUserDetails: boolean = false;
  visiblePlanDetails: boolean = false;
  // ref: DynamicDialogRef | undefined;
  userForm!: FormGroup;
  BasicShow: boolean = false;
  currentuser: any;
  Form_name: any;
  selectedUser: any;
  selectedUsers: any[] | undefined;
  UserType = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Staff', value: 'Staff' },
  ];
  currentPlanDetails: any;
  currentCouponDetails:any;
  cols:any;
  ;
  selectedPlan: string = '';
  selectedCoupon : string = '';
  planList = [
    { planName: 'Plan 1', value: 'plan1' },
    { planName: 'Plan 2', value: 'plan2' },
    // Add more objects as needed
  ];
  couponList = [
    { planName: 'Plan 1', value: 'plan1' },
    { planName: 'Plan 2', value: 'plan2' },
    // Add more objects as needed
  ];
  
  constructor(public crudService: CrudserviceService, private fb: FormBuilder,
    private datePipe: DatePipe, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      company_name: ['', [Validators.required, Validators.minLength(3)]],
      emailId: ['', [Validators.required, Validators.email]],
      mobile_no: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      user_type: ['', Validators.required],
      gst_no: [''],
      password: ['', [Validators.required, Validators.minLength(4)]],
      email_verified: [''],
      company_no: ['']
    });

    this.viewUserData();
    this.viewPlanData();
    this.viewCouponData();

    this.cols = [
      { field: 'createdAt', header: 'Reg Date' },
      { field: 'user_name', header: 'User Name' },
      { field: 'company_name', header: 'Company name' },
      { field: 'emailId', header: 'email' },
      { field: 'mobile_no', header: 'Mobile' },
      { field: 'user_type', header: 'User Type' },
      { field: 'gst_no', header: 'GST no' },
      { field: 'planName', header: 'Current Plan' },
      { field: 'validity', header: 'Plan Validity Till' },
      { field: 'couponName', header: 'Coupon' },
      { field: 'planStatus', header: 'Plan Status' }
    ];
  }

  viewPlanData() {
    console.log('this.planList222222222');
    this.crudService.getAllPlan().subscribe((data: any) => {

      this.planList = data.statusCode.data.plans;
      console.log('this.planList', this.planList);

    });
  }
  viewCouponData() {
    console.log('this.viewCouponData222222222');
    this.crudService.getAllCoupon().subscribe((data: any) => {
   
      this.couponList = data.statusCode.data.coupons;
      console.log('this.couponList',this.couponList);

    });
  }
  gstValidator(control: AbstractControl): ValidationErrors | null {
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

    if (control.value && !gstPattern.test(control.value)) {
      return { invalidGST: true };
    }

    return null;
  }



  showDialog() {
    this.BasicShow = true;
  }

  viewUserData() {
    console.log('this.userList222222222');
    this.crudService.getAllUser().subscribe((data: any) => {
      this.userList = data.statusCode.data.users;
      
      console.log('this.userList', this.userList);
    });
  }

  exportExcel(selectedUsers: any, table: any) {
    let JsonData: any[] = [];
    if (this.selectedUsers != null && this.selectedUsers.length > 0) {
      JsonData = this.selectedUsers;
    } else {
      if (typeof table.filteredValue !== 'undefined') {
        if (table.filteredValue.length !== this.userList.length && table.filteredValue.length > 0) {
          JsonData = table.filteredValue;
        } else {
          JsonData = this.userList;
        }
      } else {
        JsonData = this.userList;
      }
    }
  
    type ReformattedObject = { [key: string]: any };
  
    let reformattedArray: ReformattedObject[] = JsonData.map(obj => {
      let rObj: ReformattedObject = {}; // Use the defined type here
      this.cols.forEach((pair: any) => {
        debugger
        if (pair.field === 'createdAt') {
          // Format createdAt field
          const createdAtDate = new Date(obj.createdAt);
          const formattedCreatedAt = createdAtDate.toISOString().split('T')[0];
          rObj[pair.header.toString()] = formattedCreatedAt;
        }
        else if (pair.field === 'planName') {
          rObj[pair.header.toString()] = obj.orderDetails?.planDetails?.planName || '';
        } else if (pair.field === 'validity') {
          rObj[pair.header.toString()] = obj.orderDetails?.validity ? this.datePipe.transform(obj.orderDetails?.validity, 'mediumDate') : '';
        } else if (pair.field === 'couponName') {
          rObj[pair.header.toString()] = obj.orderDetails?.couponName || '';
        } else if (pair.field === 'planStatus') {
          rObj[pair.header.toString()] = obj.orderDetails?.Active ? 'Active' : 'Inactive';
        } else {
          rObj[pair.header.toString()] = obj[pair.field];
        }
      });
      return rObj;
    });
  
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(reformattedArray);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'users');
    });
  }
  
  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      let timeStamp = this.datePipe.transform(new Date(), 'ddMMyy_HHmm');
      FileSaver.saveAs(data, fileName + '_' + timeStamp + EXCEL_EXTENSION);
    });
  }

  openNew() {
    this.Form_name = "Add User"
    this.userForm.setValue({
      user_name: null,
      email_verified: null,
      company_name: null,
      emailId: null,
      mobile_no: null,
      password: null,
      gst_no: null,
      user_type: null,
      company_no: null

    });

    console.log(this.UserType);
    this.currentuser = null
    this.visible = true;
  }

  async viewDetails(user: any) {
    console.log('visible');
    this.selectedUser = user
    if (user.orderId) {
      this.crudService.getDetailsById('order', user.orderId).subscribe((data: any) => {

        this.selectedUser.orderDetails = data.statusCode.data;
        console.log('this.this.selectedUser', this.selectedUser);
        if(data){
          this.visibleUserDetails = true;
        }
      });
    }
    else{
      this.visibleUserDetails = true;
    }

  

  }

  editSelectedStaff(user: any) {
    this.Form_name = "Edit User"
   
    console.log("user", user);
    this.crudService.getDetailsById('user', user._id).subscribe((data: any) => {

      if(data){
        user = data.statusCode.data 
        this.userForm.setValue({
          user_name: user.user_name,
          email_verified: user.email_verified,
          company_name: user.company_name,
          emailId: user.emailId,
          mobile_no: user.mobile_no,
          password: user.original_password,
          gst_no: user.gst_no,
          user_type: user.user_type,
          company_no: user.company_no
    
        });
        this.currentuser = user
        this.visible = true;
      }
      else {
        console.log("dataaaaa", data);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 1000 });
      }
      debugger
    });

debugger

  }


  deleteStaff(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete User',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // tslint:disable-next-line: prefer-for-of
        this.crudService.deletebyId(user, 'user').subscribe((data: any) => {
          if (data.statusCode.success) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Staff Deleted', life: 1000 });
            this.viewUserData();
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

  onSubmit(form: FormGroup) {
    if (this.userForm.valid) {
      const edata: any = {
        user_name: form.value.user_name,
        email_verified: true,
        company_name: form.value.company_name,
        emailId: form.value.emailId,
        mobile_no: form.value.mobile_no,
        password: form.value.password,
        is_deleted: false,
        gst_no: form.value.gst_no,
        user_type: form.value.user_type,
        company_no: "",
        profile_image: "",

      }
      console.log("this.currentuser", this.currentuser);

      if (this.currentuser) {

        edata._id = this.currentuser._id
        edata.company_no= this.currentuser.company_no,
        edata.profile_image= this.currentuser.profile_image
      }
      console.log("edataaaaaaaaaaaaaaa", edata);
      this.crudService.adduser(edata).subscribe((data: any) => {
        if (data.statusCode.success) {
          console.log("dataaaaa", data);

          this.visible = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 1000 });
          this.viewUserData();
        } else {
          console.log("dataaaaa", data);
          this.visible = true;
          // this.mytable = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 1000 });
        }
      });
      // Handle form submission, e.g., send data to the server
      console.log('Form submitted:', this.userForm.value);
    } else {
      // Form is invalid, mark all fields as touched to display error messages
      this.markFormGroupTouched(this.userForm);
    }
  }
  onEditSave(form: FormGroup) {

    const edata = {
      username: form.value.username,
      phone: form.value.phone,
      email: form.value.email,
      password: form.value.password,
      Designation: form.value.Designation
    }

  }

  Manageplan() {
    this.visiblePlanDetails = true
    if(this.selectedUser.havePlan){
      this.selectedPlan = this.selectedUser.planId
      this.selectedUser.orderDetails.couponName = this.selectedCoupon
    }
    else{
      this.selectedPlan = ''
      this.selectedCoupon =''
    }
   
    debugger
  }
  selectplan(event: any) {
   
    console.log("selected plan  event.target.value", event.target.value);
    this.currentPlanDetails = this.planList.filter((data: any) => {
      return data._id == event.target.value;
    });
    console.log(" this.currentPlanDetails ",  this.currentPlanDetails );
  }

async ActivePlan() {

  if(this.selectedPlan == ''){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a plan', life: 1000 });
  }
  else{
    var totalFinalprice = this.currentPlanDetails[0].totalPrice
    if (this.selectedCoupon !== "") {
      let edata3 = {
        couponName: this.selectedCoupon,
        planId: this.selectedPlan,
        userId: this.selectedUser._id
      };
  
      try {
        const data: any = await this.crudService.applyCoupon(edata3).toPromise();
  
        if (data.statusCode.success) {
          let responsedata = data.statusCode.data;
          console.log(data.statusCode.data);
          totalFinalprice = Number(responsedata.totalprice);
          debugger;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 1000 });
          return; // Exit function if coupon application failed
        }
      } catch (error) {
        console.error("Error applying coupon:", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred applying the coupon.', life: 1000 });
        return; // Exit function if an error occurred
      }
    }
  
    let edata = {
      userId: this.selectedUser._id,
      amount: totalFinalprice,
      payment_type: "direct_payment",
      planId: this.selectedPlan,
      currency: "INR",
      couponName: this.selectedCoupon
    };
  
    console.log("edataaaaaaaaaa", edata);
    debugger;
  
    this.crudService.createDirectOrder(edata).subscribe((data: any) => {
      if (data.statusCode.success) {
        debugger;
        const orderDetail = data.statusCode.data;
        let edata2 = {
          order_id: orderDetail._id,
          userId: this.selectedUser._id,
          planId: this.selectedPlan,
          paymentdetails: { amount: this.currentPlanDetails.amount },
          couponName: this.selectedCoupon
        };
  
        this.crudService.successDirectOrder(edata2).subscribe((data: any) => {
          if (data.statusCode.success) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Plan Updated', life: 1000 });
            this.visiblePlanDetails = false;
            this.visibleUserDetails = false;
            this.viewUserData();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 1000 });
          }
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 1000 });
      }
    });
  }

}
  InactivePlan(){
    let edata = {
      id:  this.selectedUser.orderDetails._id
    }

    this.crudService.deactivateDirectOrder(edata).subscribe((data: any) => {
      if (data.statusCode.success) {
        debugger
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Plan Updated', life: 1000 });
        this.visiblePlanDetails = false
        this.visibleUserDetails = false
        this.viewUserData()
      }
      else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 1000 });
        }
      })

  }

  selectcoupon(event: any) {
    console.log("selected plan  event.target.value", event.target.value);
    debugger
    this.selectedCoupon =  event.target.value
    // this.currentCouponDetails = this.couponList.filter((data: any) => {
    //   this.currentCouponDetails = data
    //   this.selectedCoupon = data.couponName
    //   return data.couponName == event.target.value;
    // });
    // if(this.currentCouponDetails.length == 0){
    //   this.selectedCoupon = ''
    // }
  }
  applyCoupon(){
    let edata={
      couponName:this.selectedCoupon,
      planId:this.selectedPlan,
      userId:this.currentuser._id
    }
    debugger
    this.crudService.applyCoupon(edata).subscribe((data: any) => {
      if (data.statusCode.success) {
      debugger
      }
      else{
         this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 1000 });
      }
    })
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