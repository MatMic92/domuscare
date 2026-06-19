const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`DomusCare API in ascolto su porta ${PORT}`);
});
