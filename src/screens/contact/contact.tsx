import React, { useState } from 'react';
import './contact.css';
import { TypingAnimation } from '../../components/typing-text/typing-text';
import { useScreen } from '../../context/ScreenContext';
import { Link } from 'react-router-dom';
import emailjs from "@emailjs/browser";

export const Contact: React.FC = () => {
  const { isScreenOn } = useScreen();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     emailjs
      .send(
        "service_rsy5zdd",
        "template_kl6xxrm",
        {
          name: formData.name,
          to_name: "MohammedFadl",
          email: formData.email,
          to_email: "mohammedfadl.work@gmail.com",
          message: formData.message,
        },
        "ORYYkppNCQefUQ3tf"
      )
      .then(
        () => {
          // setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");

          setFormData({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          // setLoading(false);
          console.error(error);

          alert("Ahh, something went wrong. Please try again.");
        }
      );
  };

  const personalInfo = `> Name: Mohammed Fathl Mohammed Al-Ghorbany
> Phone: +967 778 940 511
> Email: mohammedfadl.work@gmail.com
> Birth Date: 2001/01/05 
> Github: https://github.com/MoAlghorbani`;

  return <> 
    {isScreenOn && (
      <div className='contact-container'>
      <Link to={'/'} className='link'>{'<'} - RETURN TO MENU</Link>
      <div className='contact-section contact-details-section'>
        <h3 className='text-q contact-title'>CONTACT DETAILS</h3>
        <div className='personal-info'>
          <TypingAnimation text={personalInfo} duration={20} />
        </div>
      </div>
      <div className='contact-section availability-section'>
        <h3 className='text-q contact-title'>AVAILABILITY</h3>
        <div className='availability-info'>
          <TypingAnimation text={`> front-end development \n> Odoo development \n> Mobile development`} duration={20} />
        </div>
      </div>
      <div className='contact-section contact-form-section'>
        <h3 className='text-q contact-title'>CONTACT FORM</h3>
        <form onSubmit={handleSubmit} className='contact-form'>
          <div className='form-group'>
            <label htmlFor='name' style={{ display: 'flex', gap: '4px' }} className={`form-label ${formData.name ? 'filled' : 'empty'}`}>
              <span>Name</span><span>{'>> '}</span>
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='Your Name'
              className='form-input'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='email' style={{ display: 'flex', gap: '4px' }} className={`form-label ${formData.email ? 'filled' : 'empty'}`}>
              <span>Email</span><span>{'>> '}</span>
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='Your Email'
              className='form-input'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='message' style={{ display: 'flex', gap: '4px' }} className={`form-label ${formData.message ? 'filled' : 'empty'}`}>
              <span>Message</span><span>{'>> '}</span>
            </label>
            <textarea
              id='message'
              name='message'
              value={formData.message}
              onChange={handleInputChange}
              placeholder='Your Message'
              className='form-input message-input scroll'
              rows={3}
              required
            />
          </div>
          <button type='submit' className='submit-button'>
            Send Message
          </button>
        </form>
      </div>
    </div>
    ) }
  </>
};
