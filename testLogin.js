async function testLogin() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sarah.chen@example.com',
        password: 'password123'
      })
    });
    const data = await res.json();
    console.log('Login result:', data);
  } catch (err) {
    console.error('Login failed:', err);
  }
}

testLogin();
