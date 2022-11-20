import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact.routing.module';
import { PersonComponent } from './person/person.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [ContactComponent, PersonComponent, EditComponent],
  imports: [
    CommonModule,
    ContactRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ContactModule {}
