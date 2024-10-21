import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from '../ContactForm/ContactForm';
import ContactList from '../ContactList/ContactList';
import Filter from '../Filter/Filter';
import styles from './App.module.css';

class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  // metoda cyklu zycia do wczytywania kontaktw z LocalStorage po zamontowaniu komponentu
  componentDidMount(){
    const savedContacts = localStorage.getItem('contacts'); //pobiera dane z LS pod kluczem 'contacts'
    if (savedContacts) {
      this.setState({ contacts: JSON.parse(savedContacts) }); // jesli w LS istnieje wpis pod kluczem 'contacts' zostanie on zwrocony jako string
    }
  }

  // metoda cyklu zycia do zapisywania kontaktow w LocalStorage po aktualizacji komponentu
  componentDidUpdate(_, prevState) {
    if (prevState.contacts !== this.state.contacts) { // Sprawdzamy, czy poprzednia lista kontaktów (prevState.contacts) różni się od obecnej (this.state.contacts).
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts)); // jesi lista kontaktow ulegnie zmianie (np. dodano lub usunięto kontakt), porownanie zwroci true i wykona sie kod z bloku if. localStorage.setItem('contacts', - zapisuje zaktualizowana liste kontaktow w LS. JSON.stringify(this.state.contacts) - konwertuje na format JSON, aby mozna bylo go przechowac w LS.
    }
  }


  addContact = ({ name, number }) => {
    const contact = {
      id: nanoid(),
      name,
      number,
    };

    const isExistingContact = this.state.contacts.some(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (isExistingContact) {
      alert(`${name} is already in contacts.`);
      return;
    }

    this.setState((prevState) => ({
      contacts: [...prevState.contacts, contact],
    }));
  };

  deleteContact = (id) => {
    this.setState((prevState) => ({
      contacts: prevState.contacts.filter((contact) => contact.id !== id),
    }));
  };

  handleFilterChange = (e) => {
    this.setState({ filter: e.target.value });
  };

  getFilteredContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  render() {
    const { filter } = this.state;
    const filteredContacts = this.getFilteredContacts();

    return (
      <div className={styles.appContainer}>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.addContact} />

        <h2>Contacts</h2>
        <Filter value={filter} onChange={this.handleFilterChange} />
        <ContactList contacts={filteredContacts} onDeleteContact={this.deleteContact} />
      </div>
    );
  }
}

export default App;

