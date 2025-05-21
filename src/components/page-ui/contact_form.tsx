// src/components/page-ui/contact_form.tsx

'use client';
import { useState } from 'react';
import { contactUs } from '@/services/api.service';
import { toast } from 'react-toastify';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await contactUs(formData);
      if (response?.success) {
        toast.success(response.message);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          message: '',
        });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <div className="at-contactform">
      {/* Contact Us Heading (replacing occasions sliding banner) */}
      <div className="font-bold text-3xl text-center mb-6">Contact Us</div>

      {/* Smaller, size-restricted form container */}
      <div className="at-formcontainer max-w-2xl mx-auto">
        <form className="at-formtheme" onSubmit={handleSubmit}>
          <fieldset className="p-4">
            <div className="at-inputwidthfifty">
              <div className="form-group">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="at-inputwidthfifty">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Describe your message"
                value={formData.message}
                onChange={handleChange}
                className="h-32"
                required
              ></textarea>
            </div>
            <div className="at-btnsubmitcontact text-center">
              <button type="submit" className="at-btn at-btn-lg">
                Send
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
