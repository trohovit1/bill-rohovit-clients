import React, { useEffect, useState } from 'react';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState(null);
  const [clients, setClients] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get active session on load
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Load messages if logged in
  useEffect(() => {
    if (session) {
      fetchClients();
    }
  }, [session]);

  const fetchClients = async () => {
    const { data, error } = await supabase.from('master_clients').select('*');
    if (error) console.error('Error fetching clients:', error);
    else setClients(data);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Login error: ' + error.message);
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert('Signup error: ' + error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', textAlign: 'center' }}>
      <h1>Supabase Auth + Clients</h1>

      {!session ? (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />
          <button onClick={handleLogin}>Log In</button>
          <button onClick={handleSignup}>Sign Up</button>
        </>
      ) : (
        <>
          <p>Welcome, {session.user.email}</p>
          <button onClick={handleLogout}>Log Out</button>

          <h2>Clients</h2>
          <ul>
            {clients.map((client) => (
              <li key={client.id}>{client.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
