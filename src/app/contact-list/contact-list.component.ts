import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Person } from '../contact/models/person.model';
import { ContactService } from '../contact/services/contact.service';
import { PersonService } from '../contact/services/person.service';
import { ContactTypes } from '../enums/contactTypes.enum';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  persons: Person[] = [];

  constructor(
    private personService: PersonService,
    private contactService: ContactService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.personService.getAllPersons().subscribe(
      (res) => (this.persons = res),
      (err) => this.toastr.error('Erro ao buscar contatos'),
      () => this.spinner.hide()
    );
  }

  get contactTypes(): typeof ContactTypes {
    return ContactTypes;
  }

  deletePerson(personId: number): void {
    this.spinner.show();
    this.personService
      .deletePerson(personId)
      .subscribe(
        (res) => {
          this.persons = this.persons.filter((p) => p.id != personId);
          this.toastr.success('Contato excluído');
        },
        (err) => this.toastr.error('Erro ao deletar contato')
      )
      .add(() => this.spinner.hide());
  }

  deleteContact(contactId: number, personId: number): void {
    this.contactService.deleteContact(contactId).subscribe(
      (res) => {
        const personIndex = this.persons.findIndex((p) => p.id == personId);
        this.persons[personIndex].contacts = this.persons[
          personIndex
        ].contacts.filter((c) => c.id != contactId);
        this.toastr.success('Contato excluído');
      },
      (err) => {
        this.toastr.error('Erro ao deletar contato');
      }
    );
  }
}
