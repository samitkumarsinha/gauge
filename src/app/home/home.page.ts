/* eslint-disable */
import { Component } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  data = [
    {value: 3},
    {value: 2},
    {value: 9},
    {value: 1},
    {value: 7.5},
    {value: 6}
  ];
  data1 = [
    {value: 3, value1: 6},
    {value: 6, value1: 3},
    {value: 2, value1: 9},
    {value: 7, value1: 5},
    {value: 8, value1: 1}
  ];
  isModalOpen = false;
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
