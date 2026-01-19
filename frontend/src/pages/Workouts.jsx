import { useEffect, useState } from "react";
import { getToken, clearToken } from "../auth";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:4000/api/workouts";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [title, setTitle] = useState("");
  const [reps, setReps] = useState("");
  const [load, setLoad] = useState("");
  const [error, setError] = useState("");

  
  const [editingId, setEditingId] = useState(null);
  const [editReps, setEditReps] = useState("");
  const [editLoad, setEditLoad] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const navigate = useNavigate();
  const token = getToken();


  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API, { headers: { ...authHeaders } });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          clearToken();
          navigate("/login");
        }
        return;
      }

      setWorkouts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);


  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    const workout = { title, reps: Number(reps), load: Number(load) };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(workout),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Er ging iets mis");
        return;
      }

      setWorkouts((prev) => [data, ...prev]);
      setTitle("");
      setReps("");
      setLoad("");
    } catch (e) {
      setError("Network error");
    }
  };

 
  const startEdit = (w) => {
    setEditingId(w._id);
    setEditTitle(w.title);
    setEditReps(String(w.reps));
    setEditLoad(String(w.load));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditReps("");
    setEditLoad("");
  };

  const handleUpdate = async (id) => {
    const updated = { title: editTitle, reps: Number(editReps), load: Number(editLoad) };

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(updated),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Update failed");
        return;
      }

      setWorkouts((prev) => prev.map((w) => (w._id === id ? data : w)));
      cancelEdit();
    } catch (e) {
      alert("Network error");
    }
  };

  
  const handleDelete = async (id) => {
    if (!confirm("Weet je zeker?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch (e) {
      alert("Network error");
    }
  };

  
  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Workouts</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Workout toevoegen</h2>
      <form onSubmit={handleCreate} style={{ display: "grid", gap: 8 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Reps" type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
        <input placeholder="Load (kg)" type="number" value={load} onChange={(e) => setLoad(e.target.value)} />
        <button type="submit">Toevoegen</button>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>

      <hr style={{ margin: "24px 0" }} />

      <h2>Alle workouts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : workouts.length === 0 ? (
        <p>Geen workouts gevonden</p>
      ) : (
        workouts.map((w) => (
          <div key={w._id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            {editingId === w._id ? (
              <>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input type="number" value={editReps} onChange={(e) => setEditReps(e.target.value)} />
                  <input type="number" value={editLoad} onChange={(e) => setEditLoad(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button type="button" onClick={() => handleUpdate(w._id)}>Opslaan</button>
                  <button type="button" onClick={cancelEdit}>Annuleren</button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ margin: 0 }}>{w.title}</h3>
                <p style={{ margin: "6px 0" }}>Reps: {w.reps}</p>
                <p style={{ margin: "6px 0" }}>Load: {w.load} kg</p>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button type="button" onClick={() => startEdit(w)}>Aanpassen</button>
                  <button type="button" onClick={() => handleDelete(w._id)}>Verwijderen</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
