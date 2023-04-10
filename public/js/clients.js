// Fetch the list of clients from the server
fetch('/clients')
  .then(response => response.json())
  .then(clients => {
    // Get a reference to the client-list tbody element
    const clientList = document.getElementById('client-list');
    
    // Loop through the list of clients and add them to the table
    clients.forEach(client => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const emailCell = document.createElement('td');
      
      nameCell.textContent = client.name;
      emailCell.textContent = client.email;
      
      row.appendChild(nameCell);
      row.appendChild(emailCell);
      
      clientList.appendChild(row);
    });
  });
