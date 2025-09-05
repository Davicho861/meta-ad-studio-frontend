import React from 'react'
import '../src/index.css'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

export const decorators = [Story => <div style={{padding:20}}><Story/></div>]
