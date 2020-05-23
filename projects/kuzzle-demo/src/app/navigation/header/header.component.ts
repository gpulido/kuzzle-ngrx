import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MdcIconRegistry } from '@angular-mdc/web/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(iconRegistry: MdcIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry
    .addSvgIcon('logo',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/logo.svg'));

   }

  ngOnInit() {
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }


}
