import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "@layout/content-layout/header/header.component";
import { SidebarComponent } from "@layout/content-layout/sidebar/sidebar.component";

@Component({
  selector: 'app-content-layout',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './content-layout.component.html'
})
export class ContentLayoutComponent {

}
