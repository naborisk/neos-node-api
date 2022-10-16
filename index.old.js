const express = require('express')
const {spawn} = require('child_process')
const { stdin } = require('process')
const { resolve } = require('dns')
const { setTimeout } = require('timers/promises')
const pty = require('node-pty')

const app = express()
const PORT = 3000


const hc = pty.spawn('mono', ['Neos.exe'], {cwd: '/root/NeosVR/'})

hc.onData(data => {
  console.log(data)
})

//const neos = spawn('mono', ['Neos.exe'], {cwd: '/root/NeosVR/'})

//const rl = require('readline').createInterface({input: neos.stdout})

//rl.on('line', line => {
  //console.log(line)
//})

//neos.stdout.on('data', function(data) {
//  console.log(data.toString())
//})

//neos.stderr.on('data', function(data) {
  //console.log(data.toString())
//})

app.get('/', (req, res) => {
  //neos.stdin.write('users\n')

  new Promise((resolve, reject) => {
  //  neos.stdin.write('status\n')
  //  neos.stdout.resume()
  hc.write('status\n')

  hc.onData(data => {
    resolve(data)
  })

  //  neos.stdout.on('data', data => {
  //    resolve(data.toString())
  //  })
  }).then(result => {
    res.send(result)
  })
})

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`)
})
