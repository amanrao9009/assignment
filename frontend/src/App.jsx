import { useState, useEffect } from "react";
import axios from "axios";


import Papa from 'papaparse';



function App() {
  const [users, setUsers] = useState([]);
  
  const [databaseuser, setDatabaseuser] = useState([]);
  
  const exportDataAsCSV = () => {
      // Convert users data to CSV format
      const csvData = Papa.unparse(users, { header: true });
  
      // Create a temporary anchor element
      const element = document.createElement('a');
      element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
      element.download = 'users.csv';
      element.style.display = 'none';
      document.body.appendChild(element);
  
      // Trigger a click event to simulate the download
      element.click();
  
      // Clean up
      document.body.removeChild(element);
  };
  useEffect(() => {
    fetchData();
    fetchFromDatabase();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:9999/api");
      // console.log(response.data); 
      setUsers(response.data);
      console.log(response.data)
      
    } catch (error) {
      console.error(error);
      
    }
  }

  async function postData() {
    try {
      const response = await axios.post("http://localhost:9999/data", users);
      // console.log(response.data); 
      console.log("Data updated successfully!");
      fetchFromDatabase();
      
    } catch (error) {
      console.error(error);
     
    }
  }

  async function fetchFromDatabase() {
    try {
      const response = await axios.get("http://localhost:9999/data");

      setDatabaseuser(response.data);
      console.log('fatched form db')
    } catch (error) {
      console.log(error);
    }
  }

  function handleFieldChange(userId, field, newValue) {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, [field]: newValue };
      }
      return user;
    });
    setUsers(updatedUsers);
    console.log(users);
  }

  const [count, setCount] = useState(0);

  return (
    <>
      <div className="wraper">
        <div className="left">
          <h2>Data from API</h2>
        <button onClick={()=>fetchData()}>Fetch Again</button>
          <button onClick={() => postData()}>Save to Database</button>
          <div>
            {users.map((user) => (
              <div className="field" key={user.id}>
                <p>Name:{user.name}</p>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) =>
                    handleFieldChange(user.id, "name", e.target.value)
                  }
                />
                <p>Email: {user.email}</p>
                <input
                  type="text"
                  value={user.email}
                  onChange={(e) =>
                    handleFieldChange(user.id, "email", e.target.value)
                  }
                />
                <p>Gender:{user.gender}</p>
                <select
                  value={user.gender}
                  onChange={(e) =>
                    handleFieldChange(user.id, "gender", e.target.value)
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <p>Status:{user.status}</p>
                <select
                  value={user.status}
                  onChange={(e) =>
                    handleFieldChange(user.id, "status", e.target.value)
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            ))}
          </div>
         
        </div>

        <div className="right">
          <h2>Data From DB</h2>

          <button onClick={()=>fetchFromDatabase()}>Refresh</button>
          <button onClick={()=>exportDataAsCSV()}>Export as CSV</button>
          <div>
            {databaseuser.map((user) => (
              <div className="field" key={user.id}>
                <p>Name: {user.name}</p>
                {/* <input
                  type="text"
                  value={user.name}
                  onChange={(e) =>
                    handleFieldChange(user.id, "name", e.target.value)
                  }
                /> */}
                <p>Email: {user.email}</p>
                {/* <input
                  type="text"
                  value={user.email}
                  onChange={(e) =>
                    handleFieldChange(user.id, "email", e.target.value)
                  }
                /> */}
                <p>Gender:{user.gender}</p>
                {/* <select
                  value={user.gender}
                  onChange={(e) =>
                    handleFieldChange(user.id, "gender", e.target.value)
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select> */}
                <p>Status:{user.status}</p>
                {/* <select
                  value={user.status}
                  onChange={(e) =>
                    handleFieldChange(user.id, "status", e.target.value)
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select> */}
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </>
  );
}

export default App;
