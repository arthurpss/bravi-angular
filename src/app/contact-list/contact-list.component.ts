import { Component, OnInit } from '@angular/core';
import { ContactTypes } from '../enums/contactTypes.enum';
import { Person } from '../contact/models/person.model';
import { PersonService } from '../contact/services/person.service';
import { ContactService } from '../contact/services/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  persons: Person[] = [];

  constructor(
    private personService: PersonService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.personService.getAllPersons().subscribe(
      (res) => (this.persons = res),
      (err) => console.log('Erro ao encontrar contatos.')
    );
  }

  get contactTypes(): typeof ContactTypes {
    return ContactTypes;
  }

  deletePerson(personId: number): void {
    this.personService
      .deletePerson(personId)
      .subscribe(
        (res) => (this.persons = this.persons.filter((p) => p.id != personId))
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
