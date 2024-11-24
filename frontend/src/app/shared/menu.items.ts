import { state } from "@angular/animations";
import { Injectable } from "@angular/core";

export interface Menu{
  state:string;
  name:string;
  icon:string;
  role:string;
}
const MENUITEMS = [
  {state:'dashboard',name:'Dashboard',icon:'dashboard',role:''},
  {state:'category',name:'Famille',icon:'category',role:'admin'},
  {state:'product',name:'Material',icon:'inventory_2',role:'admin'},
  {state:'order',name:'Manage Decharge',icon:'list_alt',role:''},
  {state:'bill',name:'Decharge',icon:'list',role:''},
  {state:'user',name:'Utilisateur',icon:'manage_accounts',role:''},
];
@Injectable()
export class MenuItems{
  getMenuitem():Menu[] {
    return MENUITEMS;
  }
}
