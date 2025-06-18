import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Registration component for creating a new user
// It includes a form with fields for username, password, email, first name, last name, and address
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",
    address: ""
  });
  const [message, setMessage] = useState("");

    // Handle input changes and update the form data state
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

    // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/createuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("User registered successfully! You can now log in.");
        setTimeout(() => {
        }, 2000);
      } else {
        const errorText = await res.text();
        setMessage(`Registration failed: ${errorText}`);
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
        />
        <input
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
        />
        <input
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>Register</button>
      </form>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default Register;
