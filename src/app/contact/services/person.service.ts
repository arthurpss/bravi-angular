import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Person } from '../../contact/models/person.model';

const API_URL = environment.BASE_API + 'person';

@Injectable({ providedIn: 'root' })
export class PersonService {
  constructor(private httpClient: HttpClient) {}

  createPerson(person: Person): Observable<any> {
    return this.httpClient.post<Person>(API_URL, person);
  }

  getAllPersons(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(API_URL);
  }

  getPersonById(personId: number): Observable<Person> {
    return this.httpClient.get<Person>(`${API_URL}/${personId}`);
  }

  updatePerson(person: Person): Observable<Person> {
    return this.httpClient.put<Person>(`${API_URL}/${person.id}`, person);
  }

  deletePerson(personId: number): Observable<any> {
    return this.httpClient.delete(`${API_URL}/${personId}`);
  }
}
