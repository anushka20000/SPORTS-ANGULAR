import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {TutopiaModalConfig} from "../../../modules/modal/TutopiaModal/modal.config";
import {TutopiaModalComponent} from "../../../modules/modal/TutopiaModal/modal.component";
import {DataTableDirective} from "angular-datatables";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../../environments/environment";
import {DataTablesResponse} from "../../../modules/DataTables/DataTablesResponse";
import {DrawerComponent, DrawerStore} from "../../../_metronic/kt/components";
import { ActivatedRoute } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';
import { first } from 'lodash';
import { calculateLocalDateTime } from 'src/app/modules/utilities/date';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  modalConfig: TutopiaModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal_window') private modalComponent:TutopiaModalComponent;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  selectedMatch:number = 0;
  constructor(private http:HttpClient,private renderer: Renderer2, private cdr: ChangeDetectorRef, private router:Router, private toastr:ToastrService,  private route: ActivatedRoute, private services: VideoService ) {
  }
openEditForm:boolean = false;
selectedVideoId: number= 0
data:any 
id: string | null = null;
type: string | null = null;

  @Input() homeId: number | null = null;
  // @Input() type: number | null = null;


onEditFormClose() {
  this.openEditForm = false;
  this.selectedVideoId = 0;
  this.refreshGrid(); // refresh the grid after editing
}
  private loadGrid() {
    let url = `${environment.apiUrl}/admin/items/`+ this.id;
    const that = this;
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            url,
            {...dataTablesParameters, id: this.id}
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
      stateSave: false,
      order:[[0,'desc']],
      columns: [
        {
          title: 'ID',
          data: 'id',
          visible: false,
          searchable: true,
          orderable:true,
          width:"100px",
          className:"text-muted text-center"

        },
        {
          title: 'League',
          data: 'league_name',
          visible: true,
          searchable: true,
          orderable:true,
          width:"100px",
          className:"text-center",
          render:  function (data: any, type: any, full: any) {
            return '<div class="d-flex align-items-center mb-7">' +
              '<div class="flex-grow-1">' +
              '<span class="text-dark fs-6"> ' + data + ' </span>' +
              // '<span class="text-muted d-block ">' + full.seasonName + '</span>' +
              '</div>' +
              '</div>';
          }
        },
        {
          title: 'Team A',
          data: 'team_a_name',
          visible: true,
          searchable: true,
          orderable:true,
          render:  function (data: any, type: any, full: any) {
            return '<div class="d-flex align-items-center mb-7">' +
              '<div class="flex-grow-1">' +
              '<div class="symbol symbol-24px me-2"> <img src="' + full.team_a_logo + '"> '+
              '<span class="text-dark fs-6"> ' + data + ' </span>' +
              '</div>' +
              '</div>';
          }
        },
        {
          title: 'Team B',
          data: 'team_b_name',
          visible: true,
          searchable: true,
          orderable:true,
          render:  function (data: any, type: any, full: any) {
            return '<div class="d-flex align-items-center mb-7">' +
              '<div class="flex-grow-1">' +
              '<div class="symbol symbol-24px me-2"> <img src="' + full.team_b_logo + '"> '+

              '<span class="text-dark fs-6"> ' + data + ' </span>' +
              '</div>' +
              '</div>';
          }
        },
        
            {
                 title: 'Date',
                 data: 'match_time_start',
                 visible: true,
                 searchable: true,
                 orderable:true,
                 className:"text-center",
                 render: function (data: any, type: any, full: any) {
                   const status = full.status;
                   let statusText="";
                   if (status == 0)
                   {
                     statusText =  '<span class="badge badge-light-primary">Upcoming</span>';
                   }
                   else if(status == 1)
                   {
                     statusText =  '<span class="badge badge-light-danger">Live</span>';
                   }
                   else if(status == 2)
                   {
                     statusText =  '<span class="badge badge-light-success">Completed</span>';
                   }
                   return '<div class="d-flex align-items-center mb-7">' +
                   '<div class="flex-grow-1">' +
                     statusText +
                   '<span class="text-muted d-block ">' +
                     calculateLocalDateTime(full.match_time_start)
                   + '</span>' +
                   '</div>' +
                   '</div>';
       
       
                 }
               },
        // {
        //   title: 'Acronym',
        //   data: 'acronym',
        //   visible: true,
        //   searchable: true,
        //   orderable:true,
        //   render:  function (data: any, type: any, full: any) {
        //     return data == null ? '' : '<div class="d-flex align-items-center mb-7">' +
        //       '<div class="flex-grow-1">' +
        //       '<span class="text-dark fs-6"> ' + data + ' </span>' +
        //       '</div>' +
        //       '</div>';
        //   }
        // },
        // {
        //   title: 'Image',
        //   data: 'image',
        //   visible: true,
        //   searchable: false,
        //   orderable:false,
        //   render: function (data: any, type: any, full: any) {
        //     return '<div class="d-flex align-items-center border border-gray-300 p-5 rounded">' +
        //         '<div class="symbol symbol-24px fs-6"> <img src="' +full.image+ '"></div>' +
        //       '</div>';
        //   }

        // },
        {
          title: 'ACTION',
          data: 'action',
          visible: true,
          searchable: false,
          width:"200px",
          className:"text-center",
          orderable:false,
          render: function (data: any, type: any, full: any) {
            return   '<button  title="edit"  action="edit_home_item" data-id="'+full.id+'"  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">' +
            '<span class="svg-icon svg-icon-3 action="edit_home_item">' +
            '<img width="16" height="16"  action="edit_home_item"  data-id="'+full.id+'" ' +
            'src="./assets/media/icons/tutopia/edit.svg"></span></button>'+
            
            '<button  title="Delete" action="match_video_delete" data-id="'+full.id+'"  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">' +
            '<span class="svg-icon svg-icon-3">' +
            '<img width="16" height="16" action="match_video_delete" data-id="'+full.id+'" ' +
            'src="./assets/media/icons/tutopia/delete.svg"></span></button>';


           

           

             
          }
        }],
    };
  }
  
  refreshGrid(){
    this.selectedMatch  = 0;
    DrawerComponent.hideAll();
    this.openEditForm = false;

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

  private showDrawer(name:string) {
    console.log(DrawerStore.getAllInstances());
    if(DrawerStore.has(name))
    {
      DrawerComponent.hideAll();
      const instance = DrawerStore.get(name);
      console.log(instance)
      instance?.show();
    }
  }

  ngOnInit(): void {
  this.id = this.route.snapshot.paramMap.get('id');
  this.type = this.route.snapshot.paramMap.get('type');

  console.log(this.type);
 this.loadHomeDetails()
    this.loadGrid();
  }
  match_video_id = 0;
formData:any
    loadHomeDetails() {
    this.http.get(`${environment.apiUrl}/admin/home/edit/${this.id}`).subscribe((data: any) => {
      this.formData = data.data;
      console.log('xyz',this.formData)      
        this.cdr.detectChanges();
      
    }
    );
  }
 

  ngAfterViewInit(): void {

    window.setTimeout(()=>{
      let base = $("#plans_table").find("thead").find("tr");
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
      const element = event.target;
    
      if (element.hasAttribute("data-id") && element.hasAttribute("action") ) {
        // console.log(element.getAttribute("data-id"),element.getAttribute("action"))
        this.match_video_id = element.getAttribute("data-id")
        this.onAction(element.getAttribute("data-id"),element.getAttribute("action"));
      }
    });

  }
  private onAction(id:string, action:string):void {
    // alert("clicked:"+id+", action:"+action);
    // console.log('--------',action)
    this.selectedVideoId = parseInt(id);
    this.cdr.markForCheck();
    switch(action) {
      case "item_delete": {
        this.deleteEntity();
        break;
      }
      case "edit_home_item":{
        this.showDrawer("edit_home_item");
        break
      }
      default: {
        //statements;
        break;
      }
    }
  }
  deleteEntity()
  {
    if(confirm("Are you sure you want to delete this match video?")) {

      this.services.deleteMatchVideo(this.match_video_id)
          .pipe()
          .subscribe(
              data => {
                console.log(data);
                if (data.success == true) {
                  this.toastr.success("Match video deleted successfully", 'Delete '+ "Match video", {
                    timeOut: 3000,
                    progressBar: true,
                    tapToDismiss: true,
                    toastClass: 'flat-toast ngx-toastr'
                  });
                  this.refreshGrid();
                } else {
                  this.toastr.error('Error:' + data.message + ', Please try again after sometime.', 'Delete '+"Match video", {
                    timeOut: 3000,
                    progressBar: true,
                    tapToDismiss: true,
                    toastClass: 'flat-toast ngx-toastr'
                  });
                }
              },
              error => {
                this.toastr.error('Error:' + error.toString(), 'Delete '+"Match video", {
                  timeOut: 3000,
                  progressBar: true,
                  tapToDismiss: true,
                  toastClass: 'flat-toast ngx-toastr'
                });
              });
// code here
    }


  }
}
