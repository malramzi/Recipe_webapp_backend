require('dotenv').config();
const express = require('express');
const responseHandler = require('./middleware/responseHandler.js');
const db = require('./server/models/database');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
db.dbConnect()

app.use('/media', express.static('uploads'))
app.use(express.json())
app.use(cors())
app.use(responseHandler)

const recipeRoutes = require('./server/routes/recipeRoutes.js')
const categoryRoutes = require('./server/routes/categoryRouter.js')
const mealRoutes = require('./server/routes/mealRouter.js')
const mealPlanRoutes = require('./server/routes/mealPlannerRouter.js')
const userRoutes = require('./server/routes/userRouter.js');


app.use('/auth', userRoutes);
app.use('/blog', recipeRoutes);
app.use('/explore', categoryRoutes);
app.use('/meal', mealRoutes);
app.use('/planner', mealPlanRoutes);




app.listen(port, ()=> console.log(`Listening to port ${port}`)); 


