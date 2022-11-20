import { Component, OnInit } from '@angular/core';
import { ContactTypes } from '../enums/contactTypes.enum';
import { Person } from '../contact/models/person.model';
import { PersonService } from '../contact/services/person.service';
import { ContactService } from '../contact/services/contact.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.personService.getAllPersons().subscribe(
      (res) => (this.persons = res),
      (err) => console.log('Erro ao encontrar contatos.'),
      () => this.spinner.hide()
    );
  }

  get contactTypes(): typeof ContactTypes {
    return ContactTypes;
  }

  deletePerson(personId: number): void {
    this.spinner.show();
    this.personService.deletePerson(personId).subscribe(
      (res) => (this.persons = this.persons.filter((p) => p.id != personId)),
      (err) => console.log('Erro ao encontrar contatos.'),
      () => this.spinner.hide()
    );
  }

  deleteContact(contactId: number, personId: number): void {
    this.contactService.deleteContact(contactId).subscribe((res) => {
      const personIndex = this.persons.findIndex((p) => p.id == personId);
      this.persons[personIndex].contacts = this.persons[
        personIndex
      ].contacts.filter((c) => c.id != contactId);
    });
  }
}
