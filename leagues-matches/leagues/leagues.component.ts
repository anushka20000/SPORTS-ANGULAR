import {AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {TutopiaModalConfig} from "../../../modules/modal/TutopiaModal/modal.config";
import {TutopiaModalComponent} from "../../../modules/modal/TutopiaModal/modal.component";
import {DataTableDirective} from "angular-datatables";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../../environments/environment";
import {DataTablesResponse} from "../../../modules/DataTables/DataTablesResponse";
import {DrawerComponent, DrawerStore} from "../../../_metronic/kt/components";
import { LeagueService } from 'src/app/services/league.service';
import { GroupClubComponent } from '../group_club/group_club.component';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss']
})
export class LeaguesComponent {
  modalConfig: TutopiaModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  // @ViewChild('modal_window') private modalComponent:TutopiaModalComponent;
  @ViewChild('group_toggle') private modalComponent: GroupClubComponent;


  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  selectedMatch:number = 0;
  constructor(private http:HttpClient,private renderer: Renderer2, private cdr: ChangeDetectorRef, private router:Router, private toastr:ToastrService, private service: LeagueService) {

  }
openEditForm:boolean = false;
selectedLeagueId:number = 0
onEditFormClose() {
  this.openEditForm = false;
  this.selectedLeagueId = 0;
  this.refreshGrid(); // refresh the grid after editing
}

  private loadGrid() {
    let url = `${environment.apiUrl}/admin/leagues`;

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
          title: 'League',
          data: 'name',
          visible: true,
          searchable: true,
          orderable:true,
          render:  function (data: any, type: any, full: any) {
            return '<div class="d-flex align-items-center mb-7">' +
              '<div class="flex-grow-1">' +
              '<span class="text-dark fs-6"> ' + data + ' </span>' +
              '</div>' +
              '</div>';
          }
        },
        {
          title: 'Image',
          data: 'image',
          visible: true,
          searchable: false,
          orderable:false,
          render: function (data: any, type: any, full: any) {
            return '<div class="d-flex align-items-center border border-gray-300 p-5 rounded">' +
                '<div class="symbol symbol-24px fs-6"> <img src="' +full.image+ '"></div>' +
              '</div>';
          }

        },
        
        {
          title: 'ACTION',
          data: 'action',
          visible: true,
          searchable: false,
          width:"400px",
          className:"text-center",
          orderable:false,
          render: function (data: any, type: any, full: any) {
            return '<button  title="Edit League"  action="edit_league" id="edit_league_toggle" data-id="'+full.id+'"  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">' +
              '<span class="svg-icon svg-icon-3 action="edit_league" id="edit_league_toggle"">' +
              '<img width="16" height="16" action="edit_league" id="edit_league_toggle"  data-id="'+full.id+'" ' +
              'src="./assets/media/icons/tutopia/edit.svg"></span></button>'+

              '<button class="btn btn-light btn-sm align-items-center m-1" action="standing" id="standing_toggle" data-id="'+full.id+'" >' +
              '<img src="./assets/media/icons/football/score.svg" alt="Standings Icon" width="16" height="16" class="me-2"> ' + 'Standings' +'</button>' +
          
              '<button class="btn btn-light btn-sm align-items-center m-1" action="group_club" id="group_toggle" data-id="'+full.id+'" >' +
              '<img src="./assets/media/icons/football/score.svg" alt="group_clubs" Icon" width="16" height="16" class="me-2"> ' +
               'Group Clubs' +'</button>' +

              '<button  title="Delete" action="league_delete" data-id="'+full.id+'"  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">' +
              '<span class="svg-icon svg-icon-3">' +
              '<img width="16" height="16" action="league_delete" data-id="'+full.id+'" ' +
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
      instance?.show();
    }
  }

  ngOnInit(): void {
    this.loadGrid();
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
      console.log(event.target+"l");
      const element = event.target;
      if (element.hasAttribute("data-id") && element.hasAttribute("action") ) {
        this.onAction(element.getAttribute("data-id"),element.getAttribute("action"));

      }

   
    });

  }
  private onAction(id:string, action:string):void {
    // console.log("clicked:"+id+", action:"+action);
    this.selectedLeagueId = parseInt(id);
    this.cdr.markForCheck();
    switch(action) {
      case "edit_league": {
        // this.router.navigate(['/game/edit-club', id]);
        this.showDrawer("edit_league");
        break;
      }
      case "standing": {
        // this.router.navigate(['/game/edit-club', id]);
        this.showDrawer("standing");
        break;
      }
      case "group_club": {
        this.showDrawer("group_club");
        break;
      }
      case "league_delete": {
        this.deleteEntity();
        break;
      }

      default: {
        //statements;
        break;
      }
    }
  }

  deleteEntity()
  {
    if(confirm("Are you sure you want to delete this League?")) {

      this.service.onDelete(this.selectedLeagueId)
          .pipe()
          .subscribe(
              data => {
                console.log(data);
                if (data.success == true) {
                  this.toastr.success("League deleted successfully", 'Delete '+ "League", {
                    timeOut: 3000,
                    progressBar: true,
                    tapToDismiss: true,
                    toastClass: 'flat-toast ngx-toastr'
                  });
                  this.refreshGrid();
                } else {
                  this.toastr.error('Error:' + data.message + ', Please try again after sometime.', 'Delete '+"League", {
                    timeOut: 3000,
                    progressBar: true,
                    tapToDismiss: true,
                    toastClass: 'flat-toast ngx-toastr'
                  });
                }
              },
              error => {
                this.toastr.error('Error:' + error.toString(), 'Delete '+"League", {
                  timeOut: 3000,
                  progressBar: true,
                  tapToDismiss: true,
                  toastClass: 'flat-toast ngx-toastr'
                });
              });
    }


  }
}
