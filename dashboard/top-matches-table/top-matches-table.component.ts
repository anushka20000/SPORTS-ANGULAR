import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'top-matches-table',
  templateUrl: './top-matches-table.component.html',
})
export class TopMatchesTableComponent implements OnInit {
  constructor() {}
    @Input() data: any = [];
  
  ngOnInit(): void {}
  calculateLocalDateTime(epochTime: number) {
    const date = new Date(epochTime * 1000);
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const hours12 = hours % 12;
    const dayStr = day < 10 ? '0' + day : day.toString();
    const monthStr = month < 10 ? '0' + month : month.toString();
  
    //add leading zero to hours string if less than 10
    const hoursStr = hours12 < 10 ? '0' + hours12 : hours12.toString();
    //add leading zero to minutes string if less than 10
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
    return dayStr + '/' + monthStr + '/' + year + ' ' + hoursStr + ':' + minutesStr + ' ' + ampm;
  }
}
