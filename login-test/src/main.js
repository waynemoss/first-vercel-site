import './style.css'
import { supabase } from './supabaseClient.js'

async function showLogin() {
  document.querySelector('#app').innerHTML = `
    <main class="login-container">
      <h1>Login</h1>

      <form id="login-form">
        <label>Email</label>
        <input id="email" type="email" required />

        <label>Password</label>
        <input id="password" type="password" required />

        <button type="submit">Sign in</button>
      </form>

      <p id="message"></p>
    </main>
  `

  document.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    const message = document.querySelector('#message')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      message.textContent = error.message
      return
    }

    showDashboard()
  })
}

async function showDashboard() {
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    showLogin()
    return
  }

  document.querySelector('#app').innerHTML = `
    <main class="dashboard-container">
      <h1>Dashboard</h1>
      <p>You are logged in as <strong>${data.user.email}</strong></p>

      <section>
        <h2>Secure Page</h2>
        <p>This content is only shown to logged-in users.</p>
      </section>

      <button id="logout-button">Logout</button>
    </main>
  `

  document.querySelector('#logout-button').addEventListener('click', async () => {
    await supabase.auth.signOut()
    showLogin()
  })
}

async function checkSession() {
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    showDashboard()
  } else {
    showLogin()
  }
}

checkSession()
