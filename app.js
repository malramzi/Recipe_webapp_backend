require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const responseHandler = require('./middleware/responseHandler.js');
const db = require('./server/models/database');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
db.dbConnect()

app.use('/media', express.static('uploads'))
app.use(cookieParser('CookingBlogSecure'));

app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(express.json())
app.use(cors())
app.use(responseHandler)

const recipeRoutes = require('./server/routes/recipeRoutes.js')
const categoryRoutes = require('./server/routes/categoryRouter.js')
const mealRoutes = require('./server/routes/mealRouter.js')
// const mealPlanRoutes = require('./server/routes/mealPlanRouter.js')w
const userRoutes = require('./server/routes/userRouter.js');


app.use('/auth', userRoutes);
app.use('/blog', recipeRoutes);
app.use('/explore', categoryRoutes);
app.use('/planner', mealRoutes);
// app.use('/planner', mealPlanRoutes);

app.get('/generate-postman-collection', (req, res) => {
  const endpoints = [
    { method: 'POST', url: '/auth/authSignup', body: { first_name: 'John', last_name: 'Doe', email: 'john@doe.com', password: 'password' } },
    { method: 'POST', url: '/auth/authLogin', body: { email: 'john@doe.com', password: 'password' } },
    { method: 'GET', url: '/auth/users' },
    { method: 'PUT', url: '/auth/user/:id', body: { first_name: 'Jane', last_name: 'Doe', email: 'jane@doe.com', password: 'password' } },
    { method: 'DELETE', url: '/auth/user/:id' },
    { method: 'GET', url: '/blog/recipes' },
    { method: 'POST', url: '/blog/recipes', body: { title: 'Veggie Pad Thai', description: 'Cook the noodles according to the packet instructions, then drain and refresh under cold running water and toss with 1 teaspoon of sesame oil.', ingredients: ['150 g rice noodles', 'sesame oil', '2 cloves of garlic', '80 g silken tofu', 'low-salt soy sauce'], category: 'Thai', label_image: 'veggie-pad-thai.jpg', posted_by: '61d42d0bfbf0d5f0a6e7fa6c' } },
    { method: 'GET', url: '/blog/recipe/:id' },
    { method: 'PUT', url: '/blog/recipe/:id', body: { title: 'Veggie Pad Thai', description: 'Cook the noodles according to the packet instructions, then drain and refresh under cold running water and toss with 1 teaspoon of sesame oil.', ingredients: ['150 g rice noodles', 'sesame oil', '2 cloves of garlic', '80 g silken tofu', 'low-salt soy sauce'], category: 'Thai', label_image: 'veggie-pad-thai.jpg', posted_by: '61d42d0bfbf0d5f0a6e7fa6c' } },
    { method: 'DELETE', url: '/blog/recipe/:id' },
    { method: 'POST', url: '/planner/meal', body: { name: 'Veggie Pad Thai', proteins: 30, carbs: 40, fats: 20, scale: 'g', calories: 250, description: 'Cook the noodles according to the packet instructions, then drain and refresh under cold running water and toss with 1 teaspoon of sesame oil.', recipe: '61d42d0bfbf0d5f0a6e7fa6c', image: 'veggie-pad-thai.jpg' } },
    { method: 'GET', url: '/planner/meals' },
    { method: 'GET', url: '/planner/meal/:id' },
    { method: 'PUT', url: '/planner/meal/:id', body: { name: 'Veggie Pad Thai', proteins: 30, carbs: 40, fats: 20, scale: 'g', calories: 250, description: 'Cook the noodles according to the packet instructions, then drain and refresh under cold running water and toss with 1 teaspoon of sesame oil.', recipe: '61d42d0bfbf0d5f0a6e7fa6c', image: 'veggie-pad-thai.jpg' } },
    { method: 'DELETE', url: '/planner/meal/:id' },
  ];

  const collection = {
    info: {
      name: 'Cooking Blog API',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: []
  };

  endpoints.forEach(endpoint => {
    const item = {
      name: endpoint.method + ' ' + endpoint.url,
      request: {
        method: endpoint.method,
        header: [],
        url: {
          raw: endpoint.url,
          host: ['{{API_URL}}'],
          path: endpoint.url.split('/').filter(path => path !== ''),
          query: []
        },
        body: endpoint.body ? { mode: 'raw', raw: JSON.stringify(endpoint.body) } : undefined
      },
      response: []
    };

    collection.item.push(item);
  });

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Content-Disposition', 'attachment; filename="data.json"');

  res.send(JSON.stringify(collection)); 
});




app.listen(port, ()=> console.log(`Listening to port ${port}`)); 


