const app = require('./src/app/express.config');
//mongodb connect


app.listen(8900, () => {
    console.log('listening on port 8900!!');
});



module.exports = app;
