import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: ContactComponent },
  { path: 'edit/:id', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactRoutingModule {}
