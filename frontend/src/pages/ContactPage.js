import { useState } from 'react';
import Nav from '../components/Nav';
import API from '../api'; // Import your configured Axios API!

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 1. Make this function async so we can use await for the API call
  const validateContactForm = async (e) => {
    e.preventDefault();
    let newErrors = {};
    let valid = true;

    if (formData.name.trim() === "") {
      newErrors.name = "Required";
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() === "") {
      newErrors.email = "Required";
      valid = false;
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email";
      valid = false;
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = "Min 10 characters";
      valid = false;
    }

    setErrors(newErrors);

    // 2. If the form is valid, send it to the backend!
    if (valid) {
      try {
        // Send the POST request to our new /api/contact route
        await API.post('/contact', formData);
        
        alert("Message sent successfully!");
        setFormData({ name: '', email: '', message: '' }); // reset form
      } catch (error) {
        console.error('Error submitting form:', error);
        alert(error.response?.data?.message || "Failed to send message. Please try again.");
      }
    }
  };

  return (
    <>
      <header>
        <h1 className="site-title">Find Your TREASURE</h1>
        <Nav />
      </header>
      <main>
        <section className="form-container">
          <h2>Contact Us</h2>
          <form onSubmit={validateContactForm}>
            <label>Name:</label>
            <input type="text" id="name" value={formData.name} onChange={handleChange} />
            <span className="error" style={{ color: 'red', fontSize: '0.8rem', display: 'block' }}>{errors.name}</span>

            <label>Email:</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} />
            <span className="error" style={{ color: 'red', fontSize: '0.8rem', display: 'block' }}>{errors.email}</span>

            <label>Message:</label>
            <textarea id="message" value={formData.message} onChange={handleChange}></textarea>
            <span className="error" style={{ color: 'red', fontSize: '0.8rem', display: 'block' }}>{errors.message}</span>
            <br />
            <button type="submit">Submit</button>
          </form>
        </section>
        <br /><br />
        <section>
          <h2>Useful Resources</h2>
          <table className="resource-table">
            <tbody>
              <tr>
                <th>  Resource Name</th>
                <th>   Description</th>
              </tr>
              <tr>
                <td>YG Entertainment</td>
                <td>   Official company managing TREASURE</td>
              </tr>
              <tr>
                <td>YouTube</td>
                <td>   Music videos and live performances</td>
              </tr>
              <tr>
                <td>Spotify</td>
                <td>   Streaming platform for TREASURE songs</td>
              </tr>
            </tbody>
          </table>
        </section>
        <br />
        <section>
          <h2>Location</h2>
          <p>Find TREASURE at YG Entertainment HQ:</p>
          <div style={{ marginTop: '15px' }}>
            <iframe
              title="YG Entertainment Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.2443044163013!2d126.90807801530997!3d37.52576087980556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c9f3af4a6b4a5%3A0xc3c9a63b018b105!2sYG%20Entertainment!5e0!3m2!1sen!2sph!4v1683838200000!5m2!1sen!2sph"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </main>

      <footer>
        <p>Bella Donna A. Viloria | Web Programming 1</p>
      </footer>
    </>
  );
}

export default ContactPage;