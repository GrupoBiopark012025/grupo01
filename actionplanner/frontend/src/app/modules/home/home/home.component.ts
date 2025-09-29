import { Component } from '@angular/core';
import { SidebarComponent } from '@layout/content-layout/sidebar/sidebar.component';
import { HeaderComponent } from '@layout/content-layout/header/header.component';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, HeaderComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}