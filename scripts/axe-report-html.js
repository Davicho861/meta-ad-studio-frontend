#!/usr/bin/env node
// Simple converter: axe JSON -> minimal HTML report
const fs = require('fs')
const path = require('path')

const inPath = process.argv[2] || './axe-report.json'
const outPath = process.argv[3] || './axe-report.html'

if (!fs.existsSync(inPath)) {
  console.error('Input file not found:', inPath)
  process.exit(2)
}
const report = JSON.parse(fs.readFileSync(inPath, 'utf8'))

function escape(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

let html = `<!doctype html><html><head><meta charset="utf-8"><title>Axe Report</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px}h1{color:#222}pre{background:#f7f7f7;padding:10px;border-radius:6px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#fafafa}</style></head><body>`
html += `<h1>Axe Accessibility Report</h1>`
html += `<p>URL tested: ${escape(report.url || '')}</p>`
html += `<h2>Violations (${report.violations.length})</h2>`
if(report.violations.length===0){ html += `<p>No violations</p>` }
else{
  html += `<table><thead><tr><th>Id</th><th>Impact</th><th>Description</th><th>Help</th><th>Nodes</th></tr></thead><tbody>`
  report.violations.forEach(v=>{
    html += `<tr><td>${escape(v.id)}</td><td>${escape(v.impact)}</td><td>${escape(v.description)}</td><td>${escape(v.help)}</td><td>${v.nodes.length}</td></tr>`
  })
  html += `</tbody></table>`
  report.violations.forEach(v=>{
    html += `<h3>${escape(v.id)} [${escape(v.impact)}]</h3>`
    html += `<p>${escape(v.description)}</p>`
    html += `<pre>${escape(JSON.stringify(v.nodes, null, 2))}</pre>`
  })
}
html += `</body></html>`

fs.writeFileSync(outPath, html)
console.log('Written', outPath)
