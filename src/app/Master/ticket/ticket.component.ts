import { Component } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { environment } from '../../../environment/environment';
import { CrudserviceService } from '../crud.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class TicketComponent {
  TicketList: any;
  selectedTickets: any;
  paginationvalue = environment.paginatorValue;
  searchvalue: any;
  cols: any;
  speedDial: boolean = false;
  visible: boolean = false;
  // ref: DynamicDialogRef | undefined;
  ticketForm!: FormGroup;
  BasicShow: boolean = false;
  currentTicket: any;
  Form_name: any;
  visibleTicketDetails: boolean = false;
  selectedTicket: any;
  GstType: any;
  ticketList: any;
  imageUrls: Map<string, string> = new Map<string, string>();
  ticketStatus = [
    { label: 'Open', value: "Open" },
    { label: 'Inprogress', value: "Inprogress" },
    { label: 'Close', value: "Close" },
  ]
  endPoint1 = environment.apiRoot
  selectedStatus: any;
  constructor(public crudService: CrudserviceService, private fb: FormBuilder,
    private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.ticketForm = this.fb.group({
      response: ['', [Validators.required]],
      ticket_status: ['', [Validators.required]],

    });

    this.viewTicketData();

    this.cols = [
      { field: 'TicketName', header: 'Ticket Name' },
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
    this.ticketStatus = [
      { label: 'Open', value: "Open" },
      { label: 'Inprogress', value: "Inprogress" },
      { label: 'Closed', value: "Closed" },
    ]
  }





  showDialog() {
    this.BasicShow = true;
  }

  viewTicketData() {
    this.crudService.getAllData('ticket').subscribe((data: any) => {
      console.log('this.contentList', data);
      this.ticketList = data.statusCode.data.tickets;
    });

  }

  async viewDetails(Ticket: any) {
    console.log('visible');
    this.selectedTicket = Ticket
    this.selectedTicket.ticket_image_url = this.getImageUrl(this.selectedTicket.ticket_image);
    this.visibleTicketDetails = true;

  }
  editSelectedticket(Ticket: any) {
  
    this.Form_name = "Edit Ticket"
    this.visible = true;
    console.log("Ticket", Ticket);

    this.ticketForm.setValue({
      response: Ticket.response,
      ticket_status:Ticket.ticket_status,
    });
    this.currentTicket = Ticket
    this.selectedTicket = Ticket
  }
  selectstatus(event: any) {
    console.log("selected plan  event.target.value", event.target.value);
    debugger
    this.selectedStatus =  event.target.value
    // this.currentCouponDetails = this.couponList.filter((data: any) => {
    //   this.currentCouponDetails = data
    //   this.selectedCoupon = data.couponName
    //   return data.couponName == event.target.value;
    // });
    // if(this.currentCouponDetails.length == 0){
    //   this.selectedCoupon = ''
    // }
  }
  getImageUrl(imagePath: string): string {
    const timestamp = Date.now().toString();
    const imageUrl = `${this.endPoint1}${imagePath}?t=${timestamp}`;
    this.imageUrls.set(imagePath, imageUrl);
    return imageUrl;
    // if (this.imageUrls.has(imagePath)) {
    //   return this.imageUrls.get(imagePath)!;
    // } else {
    //   const timestamp = Date.now().toString();
    //   const imageUrl = `${this.endPoint1}/${imagePath}?t=${timestamp}`;
    //   this.imageUrls.set(imagePath, imageUrl);
    //   return imageUrl;
    // }
  }

  deleteTicket(Ticket: any) {
    console.log("delete", Ticket);

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Ticket',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // tslint:disable-next-line: prefer-for-of
        this.crudService.deletebyId(Ticket, 'Ticket').subscribe((data: any) => {
          if (data.statusCode.success) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Ticket Deleted', life: 1000 });
            this.viewTicketData();
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
    debugger
    if (this.ticketForm.valid) {
      const edata: any = this.selectedTicket
      edata.response = form.value.response,
      edata.ticket_status = form.value.ticket_status,


      console.log("edataaaaaaaaaaaaaaa", edata);
      this.crudService.addData('ticket', edata).subscribe((data: any) => {
        if (data.statusCode.success) {
          console.log("dataaaaa", data);

          this.visible = false;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Ticket Updated', life: 1000 });
          this.viewTicketData();
        } else {
          console.log("dataaaaa", data);
          this.visible = true;
          // this.mytable = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 1000 });
        }
      });

    } else {
      // Form is invalid, mark all fields as touched to display error messages
      this.markFormGroupTouched(this.ticketForm);
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