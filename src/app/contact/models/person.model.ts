import { Contact } from 'src/app/contact/models/contact.model';

export interface Person {
  id: number;
  name: string;
  contacts: Contact[];
}
