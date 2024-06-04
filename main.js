import axios from 'axios';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const AUTH_ENDPOINT = `${API_BASE_URL}/auth`;
const ENTRIES_ENDPOINT = `${API_BASE_URL}/entries`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [entries, setEntries] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      setIsLoggedIn(true);
      fetchEntries(token);
    }
  }, []);

  const fetchEntries = async (token) => {
    try {
      const response = await axios.get(ENTRIES_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(AUTH_ENDPOINT + '/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      fetchEntries(response.data.token);
      history.push('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    history.push('/login');
  };

  return (
    <Router>
      <Switch>
        <Route path="/login">
        </Route>
        <Route path="/">
          {isLoggedIn ? (
            <div>
              {entries.map((entry) => (
                <div key={entry.id}>
                  <h3>{entry.title}</h3>
                  <p>{need.content}</p>
                  <p>Mood: {entry.mood}</p>
                </div>
              ))}
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>Please log in to view your journal entries.</div>
          )}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
