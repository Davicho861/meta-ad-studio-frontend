import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// imports: corregida la ruta de PromptBar (está en components/PromptBar.jsx)
import PromptBar from './components/PromptBar'
import GenerationGrid from './components/GenerationGrid'
import ResultCard from './components/ResultCard'
import './styles/globals.css'

const App = () => {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <PromptBar />
        <Switch>
          <Route path="/" exact component={GenerationGrid} />
          <Route path="/result/:id" component={ResultCard} />
        </Switch>
      </div>
    </Router>
  )
}

export default App