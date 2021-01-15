const express = require('express')
const app = express()
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/us', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req,res) => {
	const shortUrls = await shortUrl.find()
	res.render('index', { shortUrls: shortUrls })
})


app.post('/shortUrls', async (req,res) => {
	await shortUrl.create({ full: req.body.fullUrl })
	res.redirect('/')
})

app.get('/:shortUrl', async (req,res) => {
	const shortUrl = shortUrl.findOne({ short: req.params.shortUrl })

	if (shortUrl === null) {return res.sendStatus(404)}

		shortUrl.clicks++
	shortUrl.save()

	res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000)