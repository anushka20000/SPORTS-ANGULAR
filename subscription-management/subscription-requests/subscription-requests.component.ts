import {AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {DataTablesResponse} from "../../../modules/DataTables/DataTablesResponse";
import * as moment from "moment";
import {DrawerComponent, DrawerStore} from "../../../_metronic/kt/components";
import {TutopiaModalConfig} from "../../../modules/modal/TutopiaModal/modal.config";
import {TutopiaModalComponent} from "../../../modules/modal/TutopiaModal/modal.component";
import {DataTableDirective} from "angular-datatables";

@Component({
  selector: 'app-subscription-requests',
  templateUrl: './subscription-requests.component.html',
  styleUrls: ['./subscription-requests.component.scss']
})
export class SubscriptionRequestsComponent implements OnInit, AfterViewInit {
  modalConfig: TutopiaModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal_window') private modalComponent:TutopiaModalComponent;
  modalBody="";
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  selectedRequest:number = 0;

  constructor(private http:HttpClient,private renderer: Renderer2,private changeDetector: ChangeDetectorRef ) {

  }

  private loadGrid()
  {
    let url = `${environment.apiUrl}/subscription-request-grid?dT=true`;

    const that = this;
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            url,
            dataTablesParameters, {}
          ).subscribe(resp => {
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data
          });
        });
      },

      serverSide: true,
      processing: true,
      autoWidth:true,
      scrollCollapse: true,
      orderCellsTop: true,
      stateSave:true,
      order:[[0,'desc']],
      columns: [
        {
          title: 'ID',
          data: 'id',
          visible: true,
          searchable: true,
          orderable:true,
          width:"100px",
          className:"text-muted text-center"

        },{
          title: 'Name',
          data: 'first_name',
          visible: true,
          searchable: true,
          orderable:true,
          render:  function (data: any, type: any, full: any) {
            return '<div class="d-flex align-items-center mb-7">' +
              '<div class="flex-grow-1">' +
              '<span class="text-dark fs-6"> ' + data +" "+full.last_name + ' </span>' +
              '<span class="text-muted d-block ">' +
             full.email + " / "+ full.phone
              + '</span>' +
              '</div>' +
              '</div>';
          }

        },
        {
          title: 'Subscription Type',
          data: 'request_type',
          visible: true,
          searchable: true,
          orderable:true,
          render: function (data: any, type: any, full: any) {
            if(data==1)
            {
              return '<div class="d-flex align-items-center mb-7">' +
                '<div class="flex-grow-1">' +
                '<span class="badge badge-light-primary fs-16">Course Subscription - '+ full.course_name+'</span>'+
                '<span class="text-dark d-block ">' +full.zone_name +" "+ full.duration_text + " - "+ full.price.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 0,
                })
              +'</span>' +
                '</div>' +
                '</div>';
            }
            else
            {
              return '<div class="d-flex align-items-center mb-7">' +
                '<div class="flex-grow-1">' +
                '<span class="badge badge-light-success fs-16">Platform Subscription - '+ full.plan_name+'</span>'+
                '<span class="text-dark d-block ">' +full.zone_name +" "+ full.duration_text + " - "+ full.price.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 0,
                })
                +'</span>' +
                '</div>' +
                '</div>';
            }
          }
        },
        {
          title: 'Status',
          data: 'status',
          visible: true,
          searchable: true,
          orderable:true,
          render: function (data: any, type: any, full: any) {

            if(data == 0)
            {
              return '<div class="d-flex align-items-center mb-7">' +
                '<div class="flex-grow-1">' +
                '<span class="badge badge-light-primary">Trial</span>'+
                '<span class="text-dark d-block "></span>'+
                '</div>' +
                '</div>';
            } else if(data == 1)
            {
              return '<div class="d-flex align-items-center mb-7">' +
              '<div class="flex-grow-1">' +
              '<span class="badge badge-light-warning">Pending</span>'+
                '<span class="text-dark d-block "></span>'+
              '</div>' +
              '</div>';
            }
            else if(data == 2)
            {
              return '<div class="d-flex align-items-center mb-7">' +
                '<div class="flex-grow-1">' +
                '<span class="badge badge-light-success">Approved</span>'+
                '<span class="text-dark d-block "></span>'+
                '</div>' +
                '</div>';
            }
            else if(data == 3)
            {
              return '<div class="d-flex align-items-center mb-7">' +
                '<div class="flex-grow-1">' +
                '<span class="badge badge-light-danger">Rejected</span>'+
                '<span class="text-dark d-block "></span>'+
                '</div>' +
                '</div>';
            }
            else if(data == 4)
            {
              return '<div class="d-flex align-items-center mb-7">' +
                '<div class="flex-grow-1">' +
                '<span class="badge badge-light-danger">Unpaid</span>'+
                '<span class="text-dark d-block "></span>'+
                '</div>' +
                '</div>';
            }
            else
            {
              return '<div class="d-flex align-items-center mb-7">' +
                '<div class="flex-grow-1">' +
                '<span class="badge badge-light">Other</span>'+
                '<span class="text-dark d-block "></span>'+
                '</div>' +
                '</div>';
            }
          }
        },

        {
          title: 'Request Date',
          data: 'created_at',
          visible: true,
          searchable: true,
          orderable:true,
          render: function (data: any, type: any, full: any) {
            return '<div class="d-flex align-items-center mb-7">' +
              '<div class="flex-grow-1">' +
              '<span class="text-dark d-block ">' + moment(data).format('ll') + '</span>'+
              '<span class="text-dark d-block "></span>'+
              '</div>' +
              '</div>';
          }
        }
        ,{
          title: 'ACTION',
          data: 'action',
          visible: true,
          searchable: false,
          width:"200px",
          className:"text-center",
          orderable:false,
          render: function (data: any, type: any, full: any) {
            return '<button  title="Process Request"  action="request_process" data-id="'+full.id+'"  ' +
              'class="btn btn-bg-light btn-active-color-primary btn-sm me-1">Process</button>'+

             /* '<button  title="Open Subscription Request" action="edit" data-id="'+full.id+'"  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">' +
              '<span class="svg-icon svg-icon-3">' +
              '<img width="16" height="16"  action="request_edit" data-id="'+full.id+'" ' +
              'src="./assets/media/icons/tutopia/edit.svg"></span></button>'+*/

              '<button  title="Delete" action="request_delete" data-id="'+full.id+'"  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">' +
              '<span class="svg-icon svg-icon-3">' +
              '<img width="16" height="16" action="request_delete" data-id="'+full.id+'" ' +
              'src="./assets/media/icons/tutopia/delete.svg"></span></button>';
          }
        }],
    };
  }

  refreshGrid(){
    this.selectedRequest = 0;
    DrawerComponent.hideAll();
    try {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        console.log(dtInstance);
        //dtInstance.destroy();
        dtInstance.ajax.reload();
        // Call the dtTrigger to rerender again
        // this.dtTrigger.next(this.dtOptions);
      });
    } catch (err) {

    }
  }

  private showDrawer(name:string)
  {
    //console.log(DrawerStore.getAllInstances());
    if(DrawerStore.has(name))
    {
      DrawerComponent.hideAll();
      const instance = DrawerStore.get(name);
      instance?.show();
    }
  }

  private onAction(id:string, action:string):void {
    //alert("clicked:"+id+", action:"+action);
    this.selectedRequest = parseInt(id);
    this.changeDetector.markForCheck();
    switch(action) {
      case "request_process": {
        this.showDrawer("open_subscription_request_drawer");
        break;
      }
      case "request_edit": {
        this.showDrawer("edit_subscription_request_drawer");
        break;
      }
      case "request_delete": {
        this.deletePlan();
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }



  ngOnInit(): void {
    this.loadGrid();
  }

  ngAfterViewInit(): void {

    window.setTimeout(()=>{
      let base = $("#subscription_requests_table").find("thead").find("tr");
      base.addClass("fw-bolder text-muted bg-light");
      base.find('th:first-child').addClass("ps-4 rounded-start");
      base.find('th:last-child').addClass("rounded-end");
      let length_name = $("div.dataTables_length").attr("id");
      console.log(length_name);
      // $("#"+length_id).addClass("resetLength form-select form-select-solid");
      $('[name="'+length_name+'"]').addClass("resetLength form-select form-select-solid bg-light");
      $("div.dataTables_filter").find("input").addClass("resetLength form-control form-control-solid bg-light");
    },100);


    this.renderer.listen('document', 'click', (event) => {
      console.log(event.target);
      const element = event.target;
      if (element.hasAttribute("data-id") && element.hasAttribute("action") ) {


        this.onAction(element.getAttribute("data-id"),element.getAttribute("action"));
      }
    });

  }
  deletePlan()
  {

  }

}
