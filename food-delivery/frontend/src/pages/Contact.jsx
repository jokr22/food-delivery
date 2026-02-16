import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p style={{ marginBottom: "2rem", textAlign: "center" }}>
        Have questions? We'd love to hear from you!
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Send Message
        </button>
      </form>

      <div style={{ marginTop: "3rem", textAlign: "center" }}>
        <h3>Contact Information</h3>
        <p>📍 123 Food Street, City, Country</p>
        <p>📞 +1 234 567 890</p>
        <p>✉️ support@fooddelivery.com</p>
      </div>
    </div>
  );
};

export default Contact;
