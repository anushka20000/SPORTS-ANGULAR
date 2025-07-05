import {AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {DataTablesResponse} from "../../../modules/DataTables/DataTablesResponse";
import * as moment from "moment";
import {DrawerComponent, DrawerStore} from "../../../_metronic/kt/components";
import {first} from "rxjs/operators";
import {TutopiaModalConfig} from "../../../modules/modal/TutopiaModal/modal.config";
import {TutopiaModalComponent} from "../../../modules/modal/TutopiaModal/modal.component";
import {ZoneService} from "../../../services/zone.service";
import { ActivatedRoute, Router } from '@angular/router';
import {DataTableDirective} from "angular-datatables";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-plan-zones',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent  implements OnInit, AfterViewInit{
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
  selectedPage:number = 0;
  constructor(private http:HttpClient,private renderer: Renderer2,
              private changeDetector: ChangeDetectorRef ,
              private zoneService:ZoneService,private router:Router, private toastr:ToastrService) {

  }

  private loadGrid()
  {
    let url = `${environment.apiUrl}/cms-grid?dT=true`;

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
          data: 'title',
          visible: true,
          searchable: true,
          orderable:true,

        },
        {
          title: 'Created',
          data: 'created_at',
          visible: true,
          searchable: true,
          orderable:true,
          render: function (data: any, type: any, full: any) {
            return moment(data).format('ll');
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
            return '<button  title="Edit Plan Zone" action="pages_edit" data-id="'+full.id+'"  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">' +
              '<span class="svg-icon svg-icon-3">' +
              '<img width="16" height="16"  action="pages_edit" data-id="'+full.id+'" ' +
              'src="./assets/media/icons/tutopia/edit.svg"></span></button>'
              ;
          }
        }],
    };
  }
  refreshGrid(){
    this.selectedPage = 0;
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
    this.selectedPage = parseInt(id);
    this.changeDetector.markForCheck();
    switch(action) {
      case "pages_edit": {
        this.showDrawer("edit_page_drawer");
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
      let base = $("#pages_table").find("thead").find("tr");
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
  deleteZone()
  {
    this.modalConfig.modalTitle = "Confirm delete";
    this.modalBody = "Are you sure you want to delete this zone?";
    this.modalConfig.dismissButtonLabel = "Yes";
    this.modalConfig.onClose = ()=>{
      //console.log("do not delete");
      return true;
    };
    this.modalConfig.onDismiss = ()=>{
      this.zoneService.onDelete(this.selectedPage)
        .pipe(first())
        .subscribe(
          data => {
            if (data.success== true) {
              this.toastr.success("Zone deleted successfully", 'Delete Zone',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
              this.refreshGrid();
            }
            else
            {
              this.toastr.error('Error:'+data.message+', Please try again after sometime.', 'Delete Zone',{
                timeOut: 3000,
                progressBar:true,
                tapToDismiss:true,
                toastClass: 'flat-toast ngx-toastr'
              });
            }
          },
          error => {
            this.toastr.error('Error:'+error.toString(), 'Delete Zone',{
              timeOut: 3000,
              progressBar:true,
              tapToDismiss:true,
              toastClass: 'flat-toast ngx-toastr'
            });
          });
      return true;
    };
    this.modalComponent.open();


  }
}
