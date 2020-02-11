import { Router } from 'express';
import axios from "axios";

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'Express Babel' });
});


async function getCats() {
  const { data } = await axios.get('https://cat-fact.herokuapp.com/facts/random?amount=3')
  return JSON.stringify({chat:data.map(({ text }) => text )})
};

async function getTacos() {
  const { data } = await axios.get('http://taco-randomizer.herokuapp.com/random?full-taco=true')
  return data.recipe
};

async function getBeer() {
  const { data } = await axios.get('https://api.punkapi.com/v2/beers/random?amount=1')
  const nom=data[0].name;
  const description=data[0].description;
  return JSON.stringify({Bierre:{nom:nom,description:description}});
};

async function getJoke() {
  const { data } = await axios.get('https://sv443.net/jokeapi/v2/joke/Programming?type=single')
  const theJoke = data.joke
  return theJoke;
};

async function getFGES() {
  return await axios.get('https://api-adresse.data.gouv.fr/search/?q=41+rue+du+port+Lille&limit=1')
  .then(({data}) => {
    var {features:[{geometry:{coordinates:[x,y]}}]} = data
    return {lat:x, long:y}
  })
  .catch((e)=>{
    return e
  })
};


routes.get('/hi', async (req,res) =>{
  const cats  = await getCats();
  const tacos = await getTacos();
  const beer = await getBeer();
  const blague = await getJoke();
  const FGES = await getFGES();
  const data = {gps: FGES, Joke: blague, Catfact:cats, beer:beer, taco:tacos}
  res.send(data);
})

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', { title });
});

export default routes;
