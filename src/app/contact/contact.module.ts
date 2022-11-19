import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact.routing.module';

@NgModule({
  declarations: [ContactComponent],
  imports: [SharedModule, ContactRoutingModule],
})
export class ContactModule {}
