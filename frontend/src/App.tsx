import React, { useState, useEffect } from 'react'
import './style.scss'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from 'react-router-dom'
import * as ROUTES from './routes'
import { useTranslation } from 'react-i18next'
import Environment from 'components/Environment'
import BMICalculator from 'components/BMICalculator'
import { HEARTBEAT } from './api'

const BackendConnectionTest = () => {
  const [response, setResponse] = useState(undefined as any)
  const [isFetching, setIsFetching] = useState(false)
  
  useEffect(() => {
    setIsFetching(true)
    fetch(HEARTBEAT).then(
      (response) => response.json()
    )
      .then(
        (response) => setResponse(response),
        (error) => setResponse({ error: error.message }),
      ).finally(() =>
        setIsFetching(false)
      )
  }, [])
  
  return (
    <>
      <h3>Backend connection test:</h3>
      <p>
        {isFetching ?
          <p>Trying to reach backend...</p>
          :
          <>
            <p>Backend responded with following message:</p>
            <b>
              <pre>
                <code>
                  {JSON.stringify(response, null, 2)}
                </code>
              </pre>
            </b>
          </>
        }
      </p>
    </>
  )
}

const Navigation = () => (
  <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
    <Link to={ROUTES.ROOT} style={{ marginRight: '20px' }}>Home</Link>
    <Link to={ROUTES.BMI_CALCULATOR}>BMI Calculator</Link>
  </nav>
)

const App: React.FC = () => {
  // Depends of your implementation of authentication
  const isLoggedIn = false
  
  return (
    <Router>
      {!isLoggedIn &&
        <>
          <Navigation />
          <Switch>
            <Route path={ROUTES.BMI_CALCULATOR}>
              <div style={{ padding: '20px' }}>
                <BMICalculator />
              </div>
            </Route>
            <Route path={ROUTES.ROOT}>
              <div style={{ padding: '20px' }}>
                <Environment />
                <hr className="dotted" />
                <BackendConnectionTest />
              </div>
            </Route>
            <Redirect from={'*'} to={ROUTES.ROOT} />
          </Switch>
        </>
      }
      {isLoggedIn &&
        <div>
          {/* <AuthenticatedSwitch /> */}
        </div>
      }
    </Router>
  )
}

export default App
