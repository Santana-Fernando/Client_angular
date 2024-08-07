import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Client';

  irAteARota() {
    let menuLateralAberto: any;
    menuLateralAberto = document.getElementById('check')

    if(menuLateralAberto.checked == true) menuLateralAberto.checked = false
    
    
  }
}
