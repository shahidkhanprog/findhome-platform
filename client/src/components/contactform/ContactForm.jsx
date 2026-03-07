import React, { useState } from "react";
import TextInput from "../common/TextInput";
import TextArea from "../common/TextArea";
import Button from "../common/Button";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Contact Form Submitted:", form);
    alert("Message sent successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg p-8 rounded-xl">
      <h3 className="text-2xl font-bold text-gray-900">Send us a Message</h3>
      <TextInput
        name="name"
        placeholder="Your Full Name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
      />
      <TextInput
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />
      <TextInput
        name="subject"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange}
        error={errors.subject}
      />
      <TextArea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        error={errors.message}
      />
      <Button type="submit" text="Send Message" />
    </form>
  );
};

export default ContactForm;