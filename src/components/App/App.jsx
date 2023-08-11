import { useState } from 'react';
import { nanoid } from 'nanoid';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, darkTheme, lightTheme, theme } from 'styles';
import { useLocalStorage } from 'react-recipes';
import { loadFromLocalStorage } from 'utilities/localStorage';
import {
  Header,
  Section,
  CreateThemeSwitcher,
  ContactForm,
  ContactList,
  Notification,
  Filter,
  OkButton,
} from 'components';

const INITIAL_CONTACTS = [
  { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
  { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
  { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
  { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
];

const localStorageKey = 'phonebook';
const localStorage_contacts = loadFromLocalStorage(localStorageKey) ?? [];
const initial_contacts = !localStorage_contacts.length
  ? [...INITIAL_CONTACTS]
  : [...localStorage_contacts];

const localStorageTheme = localStorageKey + '_theme';
const modeThemeInit =
  loadFromLocalStorage(localStorageTheme) === 'dark' ? 'dark' : 'light';

export const App = () => {
  const [modeTheme, setModeTheme] = useLocalStorage(
    localStorageTheme,
    modeThemeInit
  );

  const [contacts, setContacts] = useLocalStorage(
    localStorageKey,
    initial_contacts
  );

  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState('');

  //   useEffect(() => {

  // }, [contacts]);

  // componentDidUpdate(_, prevState) {
  //   if (this.state.contacts !== prevState.contacts) {
  //     saveToLocalStorage(localStorageKey, this.state.contacts);
  //   }

  const handleToggleTheme = () => {
    setModeTheme(prevModeTheme =>
      prevModeTheme === 'light' ? 'dark' : 'light'
    );
  };

  const onSubmit = dataForm => {
    const searchResult = searchContact(dataForm);
    if (!searchResult) {
      setContacts(prevState => [
        { id: nanoid(), ...dataForm },
        ...prevState.contacts,
      ]);
      return true;
    } else {
      setNotification(
        `${searchResult.name} : ${searchResult.number} is already in contacts`
      );
      return false;
    }
  };

  const handleOkButton = () => {
    setNotification('');
  };

  const searchContact = ({ name }) => {
    return contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleChangeInputFilter = e => {
    const inputFilter = document.getElementById('filter');
    const { value } = e.target;
    let valueNormalize = value.toLowerCase();
    inputFilter.value = valueNormalize;
    setFilter(valueNormalize);
  };

  const createContactsToList = () => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter)
    );
  };

  const deleteContactsFromList = idItem => {
    return setContacts(prevValue =>
      prevValue.contacts.filter(item => item.id !== idItem)
    );
  };

  return (
    <ThemeProvider
      theme={{
        ...theme,
        ...(modeTheme === 'light' ? lightTheme : darkTheme),
      }}
    >
      <GlobalStyles />
      <Header>
        <CreateThemeSwitcher
          handleToggleTheme={handleToggleTheme}
          modeTheme={modeTheme === 'light' ? false : true}
        />
      </Header>
      <main>
        <Section title="Phonebook">
          <ContactForm onSubmit={onSubmit} />
          {notification && (
            <Notification message={notification}>
              <OkButton type="button" onClick={handleOkButton}>
                OK
              </OkButton>
            </Notification>
          )}
        </Section>
        <Section title="Contacts">
          <Filter handleChangeInputFilter={handleChangeInputFilter} />
          <ContactList
            contactsToList={createContactsToList()}
            deleteContactsFromList={deleteContactsFromList}
          />
        </Section>
      </main>
    </ThemeProvider>
  );
};