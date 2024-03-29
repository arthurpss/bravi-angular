import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contact } from '../models/contact.model';

const API_URL = environment.BASE_API + 'contact';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private httpClient: HttpClient) {}

  createContacts(contacts: Contact[]): Observable<Contact[]> {
    return this.httpClient.post<Contact[]>(API_URL, contacts);
  }

  updateContacts(contacts: Contact[]): Observable<Contact[]> {
    return this.httpClient.put<Contact[]>(`${API_URL}`, contacts);
  }

  deleteContact(contactId: number): Observable<any> {
    return this.httpClient.delete<any>(`${API_URL}/${contactId}`);
  }

  deleteContacts(contactIds: number[]): Observable<any> {
    return this.httpClient.delete<any>(`${API_URL}`, { body: contactIds });
  }
}
