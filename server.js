import express from 'express';
import cors from 'cors';
import routes from './server/routes/routes';

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.use('/*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'This is not the page you are looking for check well the route or method',
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${port}`);
});

module.exports = app;
