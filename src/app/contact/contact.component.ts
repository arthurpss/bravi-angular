import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, mergeMap } from 'rxjs';
import { Contact } from './models/contact.model';
import { Person } from './models/person.model';
import { PersonComponent } from './person/person.component';
import { ContactService } from './services/contact.service';
import { PersonService } from './services/person.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  form!: FormGroup;
  isEdit: boolean = false;
  @ViewChild(PersonComponent) personComponent!: PersonComponent;
  person!: Person;
  personName!: string;
  deletedContacts: Contact[] = [];
  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      contacts: this.fb.array([]),
    });

    const personId = Number(this.route.snapshot.paramMap.get('id'));
    if (personId) {
      this.personService.getPersonById(personId).subscribe((response) => {
        this.person = response;
        this.isEdit = true;
        this.person.contacts.forEach((p) => {
          this.contacts.push(this.fb.group(p));
        });
        this.personComponent.form.get('name')?.setValue(this.person.name);
      });
    } else {
      this.addContact();
    }
  }

  submit() {
    let person: Person;
    if (this.isEdit) {
      person = {
        id: this.person.id,
        ...this.personComponent.form.value,
      };

      const contacts: Contact[] = this.form.value.contacts.map((c: Contact) => {
        return { ...c, person: this.person.id };
      });

      const observers = {
        updatePerson: this.personService.updatePerson(person),
        updateContacts: this.contactService.updateContacts(contacts),
      };

      forkJoin(observers).subscribe(() => {
        if (this.deletedContacts.length) {
          const deletedIds: number[] = this.deletedContacts.map((dc) => dc.id);
          this.contactService
            .deleteContacts(deletedIds)
            .subscribe(() => this.router.navigate(['contact-list']));
        } else {
          this.router.navigate(['contact-list']);
        }
      });
    } else {
      person = this.personComponent.form.value;

      this.personService
        .createPerson(person)
        .pipe(
          mergeMap((res) => {
            const contacts: Contact[] = this.form.value.contacts.map(
              (c: Contact) => {
                return { ...c, person: res.identifiers[0].id };
              }
            );
            return this.contactService.createContacts(contacts);
          })
        )
        .subscribe(() => {
          this.router.navigate(['contact-list']);
        });
    }
  }

  addContact(): void {
    this.contacts.push(this.emptyContact());
  }

  deleteContact(index: number): void {
    this.deletedContacts.push(this.contacts.at(index).value);
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
