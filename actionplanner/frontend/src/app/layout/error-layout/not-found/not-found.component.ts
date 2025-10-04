import { Component, OnInit } from '@angular/core';
import { toast } from "ngx-sonner";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-not-found',
  imports: [
    RouterLink
  ],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit {
  ngOnInit() {
    toast.dismiss();
  }
}
