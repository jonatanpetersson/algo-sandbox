import express from 'express';

express()
  .use(express.static('dist'))
  .listen(4200, () => console.log('Listening on port 4200'));
