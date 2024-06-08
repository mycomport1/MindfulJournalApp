import axios from 'axios';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const AUTHENTICATION_ENDPOINT = `${API_BASE_URL}/auth`;
const JOURNAL_ENTRIES_ENDPOINT = `${API_BASE_URL}/entries`;

function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const authToken = localStorage.getItem('token');
    if (authToken) {
      setUserAuthenticated(true);
      loadJournalEntries(authToken);
    }
  }, []);

  const loadJournalEntries = async (authToken) => {
    try {
      const { data } = await axios.get(JOURNAL_ENTRIES_ENDPOINT, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setJournalEntries(data);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const authenticateUser = async (email, password) => {
    try {
      const { data } = await axios.post(`${AUTHENTICATION_ENDPOINT}/login`, { email, password });
      localStorage.setItem('token', data.token);
      setUserAuthenticated(true);
      loadJournalEntries(data.token);
      history.push('/');
    } catch (error) {
      console.error('Error authenticating user:', error);
    }
  };

  const logOutUser = () => {
    localStorage.removeItem('token');
    setUserAuthenticated(false);
    history.push('/login');
  };

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <div>{/* Login Component could go here */}</div>
        </Route>
        <Route path="/">
          {userAuthenticated ? (
            <JournalEntriesView entries={journalEntries} handleLogout={logOutUser} />
          ) : (
            <div>Please log in to view your journal entries.</div>
          )}
        </Route>
      </Switch>
    </Router>
  );
}

const JournalEntriesView = ({ entries, handleLogout }) => (
  <div>
    {entries.map((entry) => (
      <div key={entry.id}>
        <h3>{entry.title}</h3>
        <p>{entry.content}</p>
        <p>Mood: {entry.mood}</p>
      </div>
    ))}
    <button onClick={handleLogout}>Logout</button>
  </div>
);

export default App;