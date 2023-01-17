import React from 'react'
import {useSession, useSupabaseClient, useSessionContext} from '@supabase/auth-helpers-react'
import DatetimePicker from 'react-datetime-picker'


export default function App() {
  const [startDate, setStartDate] = React.useState(new Date())
  const [endDate, setEndDate] = React.useState(new Date())
  const [eventName, setEventName] = React.useState('')
  const [eventDetails, setEventDetails] = React.useState('')

  const session = useSession(); // tokens, when session exits, we have a user
  const supabase = useSupabaseClient() ; // talk to supabase
  const {isLoading} = useSessionContext();

  if (isLoading) {
    return <></>
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  function handleInputEventName (e) {
    setEventName( e.target.value)
  }

  

  async function createEvent() {

    const event = {
      'summary': eventName,
      'description': eventDetails,
      'start': {
        'dateTime': startDate.toISOString(), // Date.toISOString() ->
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
      },
      'end': {
        'dateTime': endDate.toISOString(), // Date.toISOString() ->
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
      }
    }


      try {
          let res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
            method: "POST",
            headers: {
              'Authorization':'Bearer ' + session.provider_token // Access token for google
            },
            body: JSON.stringify(event)
          })

        if (res.ok){

          const data = await res.json()
          alert('Event Created in your Google Calendar', data)

          return data
        
        } else {

          console.log("Error: Respond not Ok")

        }


      } catch( error) {
        console.log(error, "ERROR: CAN NOT FETCH DATA")
      }
  }


  console.log(session)
  //console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)

  return (
    <div className="App">
     <div className="session-container">
        {session ? 
          <div>
            <h2>Hey there {session.user.email}</h2>
            <button onClick={() => signOut()}>Sign Out</button>
            <br/>
            <hr />
            <input 
              type="text" 
              placeholder='Enter event name...'
              value={eventName}
              onChange={handleInputEventName}
            />

            <h3>Event: {eventName}</h3>

            <input 
              type="text" 
              placeholder='Enter description name...'
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
            />

            <h3>Details: {eventDetails}</h3>


            <p>Choose start date & time of event</p>
            <DatetimePicker className="picker" onChange={setStartDate} value={startDate} />

            <p>Choose end date & time of event</p>
            <DatetimePicker className="picker" onChange={setEndDate} value={endDate} />

            <hr />
            <p></p>
            <button onClick={() => createEvent()}>Create Event</button>
            
          </div> 
            :
          <>
            <h2>Welcome to Calendar App</h2>
            <button onClick={() => googleSignIn()}>Sign In with Google</button>
          </>
        }
     </div>
    </div>
  )
}
