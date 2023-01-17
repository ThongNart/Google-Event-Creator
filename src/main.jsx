import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

//connect to Supabase
import {createClient} from '@supabase/supabase-js'
import {SessionContextProvider} from '@supabase/auth-helpers-react'


const supabase = createClient(
  "https://kbdhdsxbmpieyzhlbctq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZGhkc3hibXBpZXl6aGxiY3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM5MzA0MzcsImV4cCI6MTk4OTUwNjQzN30.ekT4QYSCgsTSg4OEcc6VunfXcfor5tOmd5FYugt6tRs"
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>,
)
 
