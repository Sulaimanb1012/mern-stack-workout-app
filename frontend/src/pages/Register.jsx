import { useState } from "react";
import { setToken } from "../auth";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:4000/api/auth/register";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Register failed");
        return;
      }

    
      setToken(data.token);
      navigate("/workouts");
    } catch (e) {
      setError("Network error");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Register</h1>

      <form onSubmit={handleRegister} style={{ display: "grid", gap: 10 }}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password (min 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Account maken</button>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>

      <p style={{ marginTop: 12 }}>
        Al een account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
