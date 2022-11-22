import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      contacts: this.fb.array([]),
    });

    const personId = Number(this.route.snapshot.paramMap.get('id'));
    if (personId) {
      this.spinner.show();
      this.personService
        .getPersonById(personId)
        .subscribe(
          (response) => {
            this.person = response;
            this.isEdit = true;
            this.person.contacts.forEach((p) => {
              this.contacts.push(
                this.fb.group({
                  contactType: [p.contactType, Validators.required],
                  contact: [p.contact, Validators.required],
                })
              );
            });
            this.personComponent.form.get('name')?.setValue(this.person.name);
          },
          (err) => console.log(err)
        )
        .add(() => this.spinner.hide());
    } else {
      this.addContact();
    }
  }

  submit() {
    if (this.form.valid && this.personComponent.form.valid) {
      this.spinner.show();
      let person: Person;
      if (this.isEdit) {
        person = {
          id: this.person.id,
          ...this.personComponent.form.value,
        };

        const contacts: Contact[] = this.form.value.contacts.map(
          (c: Contact) => {
            return { ...c, person: this.person.id };
          }
        );

        const observers = {
          updatePerson: this.personService.updatePerson(person),
          updateContacts: this.contactService.updateContacts(contacts),
        };

        forkJoin(observers)
          .subscribe(
            () => {
              this.toastr.success('Contato editado');
              if (this.deletedContacts.length) {
                const deletedIds: number[] = this.deletedContacts.map(
                  (dc) => dc.id
                );
                this.contactService
                  .deleteContacts(deletedIds)
                  .subscribe(() => {
                    this.router.navigate(['contact-list']);
                  })
                  .add(() => this.spinner.hide());
              }
            },
            (err) => this.toastr.error('Erro ao editar contato')
          )
          .add(() => {
            this.spinner.hide();
            this.router.navigate(['contact-list']);
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
          .subscribe(
            () => {
              this.toastr.success('Contato criado');
              this.router.navigate(['contact-list']);
            },
            (err) => this.toastr.error('Erro ao editar contato')
          )
          .add(() => {
            this.spinner.hide();
          });
      }
    } else {
      this.toastr.error(
        'Campos obrigatórios não preenchidos ou preenchidos incorretamente.'
      );
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
      contactType: [null, Validators.required],
      contact: [null, Validators.required],
    });
  }

  get contacts(): FormArray {
    return this.form.controls['contacts'] as FormArray;
  }

  get formGroups(): FormGroup[] {
    return this.contacts.controls as FormGroup[];
  }
}
