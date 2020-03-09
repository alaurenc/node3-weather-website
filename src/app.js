const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

const app = express();

// Define paths for Express config
const publicPathDirectory = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// Setup handlebars engine and views location
app.set('view engine','hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicPathDirectory))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Alan'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Alan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Alan',
        message: 'This is the help message'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {} ) => {
        if (error) {
            return res.send({ error });
        }

        forecast(latitude, longitude, (error, forecast) => {
            if (error) {
                return res.send({ error });
            } else {
                res.send({
                    forecast,
                    location,
                    address: req.query.address
                })
            }
        })
    })
})

app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }

    console.log(req.query);
    res.send({
        products: []
    });

});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help Error',
        name: 'Alan',
        errorMessage: 'Help Article Not Found'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alan',
        errorMessage: 'Page Not Found'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});