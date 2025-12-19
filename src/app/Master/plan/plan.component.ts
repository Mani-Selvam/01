import { Component } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { environment } from '../../../environment/environment';
import { CrudserviceService } from '../crud.service';
import { MessageService, ConfirmationService } from 'primeng/api';
// import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss',
  providers: [ MessageService, ConfirmationService]

})
export class PlanComponent {
  planList: any;
  selectedPlans: any;
  paginationvalue = environment.paginatorValue;
  searchvalue: any;
  cols: any;
  speedDial: boolean = false;
  visible: boolean = false;
  // ref: DynamicDialogRef | undefined;
  planForm!: FormGroup;
  BasicShow: boolean = false;
  currentplan: any;
  Form_name: any;
  visiblePlanDetails: boolean=false;
  selectedPlan: any;
  GstType: any;

  constructor(public crudService: CrudserviceService, private fb: FormBuilder, 
    private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit() {
    this.planForm = this.fb.group({
      planName :['', [Validators.required]],
      gstPercentage: ['', Validators.required],
      price:['', Validators.required],
      noOfUser:['', Validators.required],
      validity:['', Validators.required],
    });

    this.viewPlanData();

    this.cols = [
      { field: 'planName', header: 'Plan Name' },
      { field: 'price', header: 'Price' },
      { field: 'gstPercentage', header: 'GST' },
      { field: 'noOfUser', header: 'Mobile' },
      { field: 'validity', header: 'UserType' },
      { field: 'totalprice', header: 'TotalPrice' },
    ];
    this.GstType = [
      { label: 'Commercial', value: "2" },
      { label: 'Residential', value: "1" },
    ]
  }

 



  showDialog() {
    this.BasicShow = true;
  }

  viewPlanData() {
    console.log('this.planList222222222');
    this.crudService.getAllPlan().subscribe((data: any) => {
      console.log('this.planList',data);
      this.planList = data.statusCode.data.plans;

    });
  }

  openNew() {
   this. Form_name = "Add Plan"
    this.planForm.setValue({
      planName:null,
      gstPercentage: null,
      price: null,
      noOfUser:null,
      validity: '1year'
       
    });
    this.currentplan = null
    this.visible = true;
  }

  async viewDetails(plan: any) {
    console.log('visible');
    this.selectedPlan=plan
    // if(plan.orderId){
    //   this.crudService.getDetailsById('plan',plan._id).subscribe((data: any) => {
    //     console.log('this.planList',data);
    //     this.selectedPlan.orderDetails = data.statusCode.data;
  
    //   });
    // }

    this.visiblePlanDetails = true;

  }
  editSelectedPlan(plan: any) {
    this. Form_name = "Edit Plan"
    this.visible = true;
    console.log("plan",plan);
    
    this.planForm.setValue({
      planName:plan.planName,
      gstPercentage:plan. gstPercentage,
      price: plan.price,
      noOfUser:plan.noOfUser,
      validity: plan.validity
        
    });
    this.currentplan = plan
  }


 deletePlan(plan: any) {
  console.log("delete",plan);
  
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete Plan',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      // tslint:disable-next-line: prefer-for-of
      this.crudService.deletebyId(plan,'plan').subscribe((data: any) => {
        if (data.statusCode.success) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Plan Deleted', life: 1000 });
          this.viewPlanData();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail:data.message, life: 1000 });
        }
      });
    }
  });

}

  clear(table: Table) {
    table.clear();
    this.searchvalue = '';
  }

  onSubmit(form:FormGroup) {
    console.log();
    
    if (this.planForm.valid) {
      
      const edata:any = {
        planName:form.value.planName,
        gstPercentage: form.value.gstPercentage,
        price: form.value.price,
        noOfUser:form.value.noOfUser,
        validity: form.value.validity

    }  
      console.log("this.currentplan",this.currentplan);
    
    if(this.currentplan){
      
      edata._id = this.currentplan._id
    }
    console.log("edataaaaaaaaaaaaaaa",edata);
    this.crudService.addplan(edata).subscribe((data: any) => {
      if (data.statusCode.success) {
        console.log("dataaaaa",data);
        
        this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Plan Updated', life: 1000 });
        this.viewPlanData();
      } else {
        console.log("dataaaaa",data);
        this.visible = true;
        // this.mytable = false;
         this.messageService.add({ severity: 'error', summary: 'Error', detail:  data.message, life: 1000 });
      }
    });
      // Handle form submission, e.g., send data to the server
      console.log('Form submitted:', this.planForm.value);
    } else {
      // Form is invalid, mark all fields as touched to display error messages
      this.markFormGroupTouched(this.planForm);
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