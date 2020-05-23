import { NgModule } from '@angular/core';
import { MdcDrawerModule } from '@angular-mdc/web/drawer';
import { MdcTopAppBarModule } from '@angular-mdc/web/top-app-bar';
import { MdcListModule } from '@angular-mdc/web/list';
import { MdcIconModule } from '@angular-mdc/web/icon';
import { MdcRippleModule } from '@angular-mdc/web/ripple';
import { MdcCardModule } from '@angular-mdc/web/card';
import { MdcButtonModule } from '@angular-mdc/web/button';
import { MdcTypographyModule } from '@angular-mdc/web/typography';
import { MdcElevationModule } from '@angular-mdc/web/elevation';
import { MdcChipsModule } from '@angular-mdc/web/chips';
import { MdcMenuModule } from '@angular-mdc/web/menu';
import { MdcImageListModule } from '@angular-mdc/web/image-list';
import { MdcDialogModule } from '@angular-mdc/web/dialog';
import { MdcFormFieldModule } from '@angular-mdc/web/form-field';
import { MdcTextFieldModule } from '@angular-mdc/web/textfield';
import { MDCDataTableModule } from '@angular-mdc/web/data-table';
import { MdcSelectModule } from '@angular-mdc/web/select';
import { MdcFabModule } from '@angular-mdc/web/fab';
import { MdcSwitchModule } from '@angular-mdc/web/switch';
import { MdcSnackbarModule } from '@angular-mdc/web/snackbar';

@NgModule({
  exports: [
    MdcTopAppBarModule,
    MdcDrawerModule,
    MdcListModule,
    MdcIconModule,
    MdcRippleModule,
    MdcCardModule,
    MdcButtonModule,
    MdcTypographyModule,
    MdcElevationModule,
    MdcChipsModule,
    MdcMenuModule,
    MdcImageListModule,
    MdcDialogModule,
    MdcFormFieldModule,
    MdcTextFieldModule,
    MDCDataTableModule,
    MdcSelectModule,
    MdcFabModule,
    MdcSwitchModule,
    MdcSnackbarModule
  ]
})
export class MaterialModule {}
