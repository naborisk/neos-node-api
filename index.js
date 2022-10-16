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

neos.on('message', message => {
  if(message == 'READY') {
    console.log('Neos headless session is ready')
    READY = true
  } else {
    //console.log(message)
  }
})

const get = (path, pythonCommand) => {
  app.get(path, (req, res) => {
    console.log(`get ${path} from ${req.ip}` + (READY ? `` : ` (not ready)`))
    
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
get('/status', 'hc.status()')

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`)
})
