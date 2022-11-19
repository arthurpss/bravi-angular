import { Component, OnInit } from '@angular/core';
import { ContactTypes } from '../enums/contactTypes.enum';
import { Person } from '../person/models/person.model';
import { PersonService } from '../person/services/person.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  persons: Person[] = [];

  constructor(private personService: PersonService) {}

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
}
