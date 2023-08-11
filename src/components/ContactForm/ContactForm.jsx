import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ContactFormForm,
  ContactFormLabel,
  ContactFormInput,
  ContactFormSubmit,
} from './ContactForm.styled';

const INITIAL_STATE = {
  name: '',
  number: '',
};

export const ContactForm = ({ onSubmit }) => {
  const [dataForm, setDataForm] = useState(INITIAL_STATE);

  const handleChangeInput = e => {
    const { name, value } = e.target;
    setDataForm(prevDataForm => {
      return { ...prevDataForm, ...{ [name]: value } };
    });
  };

  const resetState = () => {
    setDataForm({ ...INITIAL_STATE });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (dataForm.name === '' || dataForm.value === '') {
      return;
    }
    if (
      !onSubmit({
        name: dataForm.name.trim(),
        number: dataForm.number,
      })
    ) {
      let valueTrim = e.currentTarget.name.value.trim();
      e.currentTarget.name.value = valueTrim;
      return;
    }
    form.reset();
    resetState();
  };

  return (
    <ContactFormForm onSubmit={handleSubmit}>
      <ContactFormLabel>
        Name
        <ContactFormInput
          type="text"
          name="name"
          minLength="2"
          maxLength="22"
          pattern="^[a-zA-Zа-яА-Я]+(([' \-][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          placeholder=""
          required
          onChange={handleChangeInput}
        />
      </ContactFormLabel>
      <ContactFormLabel>
        Number
        <ContactFormInput
          type="tel"
          name="number"
          minLength="7"
          maxLength="17"
          pattern="\+?\d{1,4}?[ .\-\s]?\(?\d{1,3}?\)?[ .\-\s]?\d{1,4}[ .\-\s]?\d{1,4}[ .\-\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          placeholder=""
          required
          onChange={handleChangeInput}
        />
      </ContactFormLabel>
      <ContactFormSubmit type="submit">Add contact</ContactFormSubmit>
    </ContactFormForm>
  );
};

ContactForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
