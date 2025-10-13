import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CONTACT_INFO, PERSONAL_INFO } from '../../utils/constants';
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'contactSubmissions'), {
        ...formData,
        timestamp: new Date(),
        status: 'unread'
      });

      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact">
      <h1 className="heading">
        Contact <span>Me</span>
      </h1>

      <div className="contact_container">
        <div className="contact_box">
          <h2>{CONTACT_INFO.title}</h2>
          <p className="desc">{CONTACT_INFO.description}</p>

          <div className="contact_detail">
            <i className="bx bx-envelope"></i>
            <div className="detail">
              <p>Email</p>
              <p>{PERSONAL_INFO.email}</p>
            </div>
          </div>

          <div className="contact_detail">
            <i className="bx bx-phone"></i>
            <div className="detail">
              <p>Phone</p>
              <p>{PERSONAL_INFO.phone}</p>
            </div>
          </div>

          <div className="contact_detail">
            <i className="bx bx-map"></i>
            <div className="detail">
              <p>Address</p>
              <p>{PERSONAL_INFO.address}</p>
            </div>
          </div>
        </div>

        <div className="contact_box">
          <form onSubmit={handleSubmit}>
            <h2 className="heading">Send Message</h2>

            {showSuccess && (
              <div className="success-message">
                Thank you for your message! I will get back to you soon.
              </div>
            )}

            <div className="field_box">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="subject"
                placeholder="Email Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
