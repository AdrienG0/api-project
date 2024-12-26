import fetch from 'node-fetch';

const data = {
  name: 'Emma Stone',
  email: 'emma@example.com',
  password: 'securepassword123'
};

fetch('http://localhost:3000/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.error('Error:', error));
