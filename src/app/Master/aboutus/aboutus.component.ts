import { Component } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { environment } from '../../../environment/environment';
import { CrudserviceService } from '../crud.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.scss',
  providers: [ MessageService, ConfirmationService]
})
export class AboutusComponent {
  contentList: any;
  selectedPlans: any;
  paginationvalue = environment.paginatorValue;
  searchvalue: any;
  cols: any;
  speedDial: boolean = false;
  visible: boolean = false;
  // ref: DynamicDialogRef | undefined;
  contentForm!: FormGroup;
  BasicShow: boolean = false;
  currentcontent: any;
  Form_name: any;
  visiblePlanDetails: boolean=false;
  selectedPlan: any;
  content: string = '';
  formattedContent: SafeHtml | undefined;
  editMode: boolean = false;

  constructor(public crudService: CrudserviceService, private fb: FormBuilder, private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit() {
    this.contentForm = this.fb.group({
      content :['', [Validators.required]],
     


    });

    this.viewContentData();


  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  showDialog() {
    this.BasicShow = true;
  }

  viewContentData() {
    console.log('this.contentList222222222');
    this.crudService.getAllData('aboutcontent').subscribe((data: any) => {
      console.log('this.contentList',data);
      this.contentList = data.statusCode.data.aboutContents;
      this. editSelectedPlan(this.contentList[0])
    });
  }

  openNew() {
   this. Form_name = "Add Plan"
    this.contentForm.setValue({
      contentName:null,
   
    });
    this.currentcontent = null
    this.visible = true;
  }

  async viewDetails(content: any) {
    console.log('visible');
    this.selectedPlan=content
    // if(content.orderId){
    //   this.crudService.getDetailsById('content',content._id).subscribe((data: any) => {
    //     console.log('this.contentList',data);
    //     this.selectedPlan.orderDetails = data.statusCode.data;
  
    //   });
    // }

    this.visiblePlanDetails = true;

  }
  editSelectedPlan(content: any) {
    console.log("content edittttt",content);
    let textWithoutTags = content.aboutContent.replace(/<[^>]*>/g, '');
    this.contentForm.setValue({
      content:textWithoutTags,
    });
    this.currentcontent = content
  }


 deletePlan(content: any) {
  console.log("delete",content);
  
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete Content',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      // tslint:disable-next-line: prefer-for-of
      this.crudService.deletebyId(content,'content').subscribe((data: any) => {
        if (data.statusCode.success) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Plan Deleted', life: 1000 });
          // this.viewPlanData();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 1000 });
        }
      });
    }
  });

}

  clear(table: Table) {
    table.clear();
    this.searchvalue = '';
  }

  async onSubmit(form: FormGroup) {
    console.log();
    
    if (this.contentForm.valid) {
        await this.formatContent(this.content);
        console.log("formattedContent", this.formattedContent);
        
        const edata: any = {
          aboutContent: this.formattedContent,
        };

        if (this.currentcontent) {
            edata._id = this.currentcontent._id;
        }

        console.log("edata", edata);

        // Call your API service's method to add/update data
        this.crudService.addData('aboutcontent', edata).subscribe((data: any) => {
            if (data.statusCode.success) {
                console.log("Data saved:", data);
                this.visible = false;
                this.editMode =false;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Content Updated', life: 1000 });
            } else {
                console.log("Error saving data:", data);
                this.visible = true;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Content Not Updated', life: 1000 });
            }
        });
    } else {
        // Form is invalid, mark all fields as touched to display error messages
        this.markFormGroupTouched(this.contentForm);
    }
}

  formatContent(content: string) {
    // Replace newline characters with <br> tags to preserve line breaks
    const formattedText = content.replace(/\n/g, '<br>');
    
    // Regex to match URLs and wrap them with anchor tags
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const formattedWithLinks = formattedText.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');

    // Sanitize the formatted content to prevent XSS attacks
    this.formattedContent = this.sanitizer.bypassSecurityTrustHtml(formattedWithLinks);
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