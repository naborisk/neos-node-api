const {PythonShell} = require('python-shell')
const express = require('express')

const app = express()
const PORT = 3000

let READY = false

const options = {
  pythonOptions: ['-u', '-i']

}

const neos = new PythonShell('api.py', options)

console.log('starting...')

//neos.send('users\n')

neos.on('message', message => {
  console.log(message)
  if(message == 'READY') READY = true
})

const get = (path, pythonCommand) => {
  app.get(path, (req, res) => {
    
    if(READY) {
    new Promise((resolve, reject) => {
      neos.send(`json.dumps(${pythonCommand})`)

      neos.once('message', message => {
        resolve(message.replaceAll("'", ''))
      })

    }).then(result => {
      res.send(JSON.parse(result))
    })
    } else {
      res.send('not ready')
    }
  })
}

get('/sessionid', 'hc.session_id()')
get('/users', 'hc.users()')
get('/worlds', 'hc.worlds()')

app.get('/status', (req, res) => {
  //res.set('Content-Type', 'application/json')

  new Promise((resolve, reject) => {
    neos.send('json.dumps(hc.status())')

    neos.once('message', message => {
      resolve(message.replaceAll("'", ''))
    })

  }).then(result => {
    res.send(JSON.parse(result))
  })
})

/*app.get('/users', (req, res) => {
  new Promise((resolve, reject) => {
    neos.send('hc.users()')

    neos.on('message', message => {resolve(message)})
  }).then(result => {
    res.send(result)
  })
})*/

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`)
})
