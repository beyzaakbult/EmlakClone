import React, { useEffect, useState } from "react";
import { Routing } from "./router/router";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "/node_modules/primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import { MainMenu } from "./layout/mainview";
import { Message } from 'primereact/message';
import { ProgressSpinner } from "primereact/progressspinner";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setError(null)
    fetch('http://localhost:8000/')
      .then(res=>res.json())
      .then(res => {
        setLoading(false);
        if (res?.message) console.log(res?.message)
      })
      .catch(err => {
        setError(err);
        setLoading(false);
        if (err?.message) {
          console.warn(err?.message)
        }
      })
  }, []) 
  
  if (loading) {
    return (
      <div className="p-8 w-full text-center">
        <ProgressSpinner />
      </div>
    )
  }
  else if (error) {
    return (
      <Message 
            className="p-8 w-full text-center" 
            severity="warn"
            content={
                <div>
                    <h1>Emlakjetski</h1>
                    <h3>Server şu anda aktif değil.</h3>
                </div>
            }
        />
    )
  }
  else return (
      <div>
        <MainMenu/>
        <div>
          <Routing/>
        </div>
      </div>
    );
}

export { App };