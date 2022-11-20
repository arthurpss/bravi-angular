import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Person } from './models/person.model';
import { Contact } from './models/contact.model';
import { PersonComponent } from './person/person.component';
import { ContactService } from './services/contact.service';
import { PersonService } from './services/person.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  form!: FormGroup;
  @ViewChild(PersonComponent) personComponent!: PersonComponent;
  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      contacts: this.fb.array([this.emptyContact()]),
    });
  }

  submit() {
    const person: Person = this.personComponent.form.value;
    this.personService.createPerson(person).subscribe((res) => {
      const contacts: Contact[] = this.form.value.contacts.map((c: Contact) => {
        return { ...c, person: res.identifiers[0].id };
      });
      this.contactService.createContacts(contacts).subscribe(() => {
        this.router.navigate(['contact-list']);
      });
    });
  }

  addContact(): void {
    this.contacts.push(this.emptyContact());
  }

  deleteContact(index: number): void {
    this.contacts.removeAt(index);
  }

  private emptyContact(): FormGroup {
    return this.fb.group({
      contactType: null,
      contact: null,
    });
  }

  get contacts(): FormArray {
    return this.form.controls['contacts'] as FormArray;
  }

  get formGroups(): FormGroup[] {
    return this.contacts.controls as FormGroup[];
  }
}
