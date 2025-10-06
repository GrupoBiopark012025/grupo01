import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { toast } from "ngx-sonner";

@Component({
  templateUrl: './forbidden.component.html',
  imports: [
    RouterLink
  ]
})
export class ForbiddenComponent implements OnInit {
  ngOnInit() {
    toast.dismiss();
  }
}
