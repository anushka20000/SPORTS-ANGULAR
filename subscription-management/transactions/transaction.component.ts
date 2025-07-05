import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { DataTablesResponse } from "../../../modules/DataTables/DataTablesResponse";
import * as moment from "moment";
import { DrawerComponent, DrawerStore } from "../../../_metronic/kt/components";
import { TutopiaModalConfig } from "../../../modules/modal/TutopiaModal/modal.config";
import { TutopiaModalComponent } from "../../../modules/modal/TutopiaModal/modal.component";
import { DataTableDirective } from "angular-datatables";
import { SubscriptionService } from "src/app/services/subscription.service";
import { ToastrService } from "ngx-toastr";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

@Component({
  selector: "transaction",
  templateUrl: "./transaction.html",
  styleUrls: ["./transaction.component.scss"],
})
export class TransactionComponent implements OnInit {
  modalConfig: TutopiaModalConfig = {
    modalTitle: "Modal title",
    dismissButtonLabel: "Submit",
    closeButtonLabel: "Cancel",
  };
  @ViewChild("modal_window") private modalComponent: TutopiaModalComponent;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  selectedMatch: number = 0;
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private services: SubscriptionService
  ) {}

  openEditForm: boolean = false;
  selectedClubId: number = 0;
  onEditFormClose() {
    this.openEditForm = false;
    this.selectedClubId = 0;
    this.refreshGrid(); // refresh the grid after editing
  }
  filteredData: any = [];
  start_date: any | null = null;
  end_date: any | null = null;
  payment_status: string | null = null;
  subscription_plan_id: string | null = null;
  league_id: string | null = null;

  subscriptionPlans:any = []
  leagues:any = []

  private loadGrid() {
    const url = `${environment.apiUrl}/admin/transactions`;

    const that = this;
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        // const from = Math.floor(new Date(this.start_date).getTime() / 1000);
        // const to = Math.floor(new Date(this.end_date).getTime() / 1000) + 86399;

        dataTablesParameters.fromDate = this.start_date;
        dataTablesParameters.toDate = this.end_date;
        dataTablesParameters.payment_status = this.payment_status;
        dataTablesParameters.subscription_plan_id = this.subscription_plan_id;
        dataTablesParameters.league_id = this.league_id;


        that.http
          .post<DataTablesResponse>(
            url,
            dataTablesParameters, {}
          ).subscribe(resp => {
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered == null ? 0 : resp.recordsFiltered,
            data: resp.data
          });
        });
      },

      serverSide: true,
      processing: true,
      autoWidth: true,
      scrollCollapse: true,
      orderCellsTop: true,
      stateSave: true,
      order: [[0, "desc"]],
      columns: [
        {
          title: "Transaction ID",
          data: "id",
          orderable: true,
          className: "text-center",
          width: "80px",
        },
        {
          title: "Plan",
          data: "subscription_plan_name",
          orderable: true,
          render: function (data: any, type: any, row: any) {
            let planHtml = `<div><div><strong>${
              data || "—"
            }</strong></div><div>${
              row.subscription_plan_description || ""
            }</div>`;
            if (row.league_name)
              planHtml += `<div><small>League: ${row.league_name}</small></div>`;
            if (row.team_A && row.team_B)
              planHtml += `<div><small>Match: ${row.team_A} vs ${row.team_B}</small></div>`;
            if (row.match_date)
              planHtml += `<div><small>Date: ${row.match_date}</small></div>`;
            planHtml += "</div>";
            return planHtml;
          },
        },
        {
          title: "Price (₹)",
          data: "subscription_plan_price",
          orderable: true,
          className: "text-center",
          render: function (data: any) {
            return `₹${data}`;
          },
        },
        {
          title: "User Info",
          data: "userInfo",
          orderable: false,
          render: function (data: any) {
            return `
            <div class="small">
              <div><strong>${data.name || "—"}</strong></div>
              <div>${data.email || ""}</div>
              <div>${data.phone || ""}</div>
            </div>`;
          },
        },
        {
          title: "Payment Details",
          data: "receipt_id",
          orderable: false,
          render: function (data: string, type: any, row: any) {
            return `
            <div class="small">
              ${data ? `<div>Receipt ID: ${data}</div>` : ""}
              ${
                row.payment_id ? `<div>Payment ID: ${row.payment_id}</div>` : ""
              }
              ${
                row.gateway_transaction_id
                  ? `<div>Gateway Txn ID: ${row.gateway_transaction_id}</div>`
                  : ""
              }
              ${
                row.payment_gateway
                  ? `<div>Gateway: ${row.payment_gateway}</div>`
                  : ""
              }
            </div>`;
          },
        },
        {
          title: "Date",
          data: "date",
          className: "text-center",
          render: function (data: string) {
            return data || "—";
          },
        },
        {
          title: "Status",
          data: "status",
          className: "text-center",
          render: function (data: string) {
            const statusMap: any = {
              Paid: "badge-light-success",
              Unpaid: "badge-light-danger",
              Cancelled: "badge-light-warning",
              null: "badge-light-secondary",
            };
            const badgeClass = statusMap[data] || "badge-light-secondary";
            return `<span class="badge ${badgeClass}">${data || "null"}</span>`;
          },
        },
      ],
    };
  }
  fetchsubscriptions() {
    this.services.getAllSubscriptions().subscribe({
      next: (res: any) => {
        this.subscriptionPlans = res.data || [];
        this.cdr.detectChanges()
        // console.log(res)
      },
      error: () => {
        this.toastr.error('Failed to load leagues');
      }
    });
  }
  refreshGrid() {
    this.selectedMatch = 0;
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
    } catch (err) {}
  }

  private showDrawer(name: string) {
    console.log(DrawerStore.getAllInstances());
    if (DrawerStore.has(name)) {
      DrawerComponent.hideAll();
      const instance = DrawerStore.get(name);
      console.log(instance);
      instance?.show();
    }
  }

  ngOnInit(): void {
    this.loadGrid();
    this.fetchsubscriptions();
    this.fetchLeagues()
  }
  clearFilters(): void {
    this.start_date = null;
    this.end_date = null;
    this.refreshGrid();
  }
  ngAfterViewInit(): void {
    window.setTimeout(() => {
      let base = $("#plans_table").find("thead").find("tr");
      base.addClass("fw-bolder text-muted bg-light");
      base.find("th:first-child").addClass("ps-4 rounded-start");
      base.find("th:last-child").addClass("rounded-end");
      let length_name = $("div.dataTables_length").attr("id");
      console.log(length_name);
      // $("#"+length_id).addClass("resetLength form-select form-select-solid");
      $('[name="' + length_name + '"]').addClass(
        "resetLength form-select form-select-solid bg-light"
      );
      $("div.dataTables_filter")
        .find("input")
        .addClass("resetLength form-control form-control-solid bg-light");
    }, 100);

    this.renderer.listen("document", "click", (event) => {
      const element = event.target;

      if (element.hasAttribute("data-id") && element.hasAttribute("action")) {
        console.log(
          element.getAttribute("data-id"),
          element.getAttribute("action")
        );
        this.onAction(
          element.getAttribute("data-id"),
          element.getAttribute("action")
        );
      }
    });
  }
  exportToExcel(data: any[], fileName: string): void {
    if (!data || data.length === 0) {
      console.warn("No data to export");
      return;
    }
  
    // Flatten userInfo and other nested fields
    const flatData = data.map((item) => ({
      id: item.id,
      status: item.status,
      payment_gateway: item.payment_gateway,
      gateway_transaction_id: item.gateway_transaction_id,
      receipt_id: item.receipt_id,
      payment_id: item.payment_id,
      start_date: item.start_date,
      end_date: item.end_date,
      subscription_plan_name: item.subscription_plan_name,
      league_name: item.league_name,
      subscription_plan_description: item.subscription_plan_description,
      subscription_plan_price: item.subscription_plan_price,
      num_days: item.num_days,
      match_date: item.match_date,
      user_name: item.userInfo?.name || '',
      user_email: item.userInfo?.email || '',
      user_phone: item.userInfo?.phone || '',
      date: item.date,
    }));
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flatData);
    const workbook: XLSX.WorkBook = {
      Sheets: { Sheet1: worksheet },
      SheetNames: ["Sheet1"],
    };
    const excelBuffer: ArrayBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  
    const blob: Blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    saveAs(blob, fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`);
  }
    fetchLeagues() {
    this.services.getLeaguelist().subscribe({
      next: (res: any) => {
        this.leagues = res || [];
        this.cdr.detectChanges()
      },
      error: () => {
        this.toastr.error('Failed to load leagues');
      }
    });
  }

download(): void {
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    const currentLength = dtInstance.page.len(); 
     const currentPage = dtInstance.page.info().page; 
    const startIndex = currentPage * currentLength; 
    const requestPayload = {
      fromDate: this.start_date,
      toDate: this.end_date,
      payment_status: this.payment_status,
      subscription_plan_id: this.subscription_plan_id,
      league_id: this.league_id,
      length: currentLength, 
      start: startIndex
    };

    const params = new HttpParams().set('exportAll', 'true');

    this.http.post(`${environment.apiUrl}/admin/transactions`, requestPayload, { params })
      .subscribe({
        next: (res: any) => {
          const data = res?.data;
          if (data && data.length > 0) {
            this.exportToExcel(data, "Transaction_Report");
          } else {
            console.warn("No data available for export.");
          }
        },
        error: (err) => {
          console.error("Failed to download transactions", err);
        },
      });
  });
}


  private onAction(id: string, action: string): void {
    this.selectedClubId = parseInt(id);
    this.cdr.markForCheck();
    switch (action) {
      default: {
        //statements;
        break;
      }
    }
  }
}
