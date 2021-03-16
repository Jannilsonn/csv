const express = require('express')
const fetch = require('node-fetch')
const https = require('https')
const fs = require('fs')
require('dotenv').config({path: '.env'})
const app = express()

const getData = async (prams) => {
	return fetch(`https://reqres.in/api/users?page=${prams.page}&per_page=${prams.per_page}`)
	.then(res => res.json())
	.then(json => json)
}

let myData = getData({page: 1, per_page: 12})

myData.then((json) => {
	let doc = 'id,email,full name,avatar\n'
	json.data.forEach((ele) => {
		doc += ele.id
		doc += ','+ ele.email
		doc += ','+ `${ele.first_name} ${ele.last_name}`
		doc += ','+ ele.avatar.split("/")[5]
		doc += '\n'

		https.get(ele.avatar, (res) => {
			let file = fs.createWriteStream(`./src/photo/${ele.avatar.split("/")[5]}`)
			res.pipe(file)
			file.on('finish', () => {
				file.close()
			})
		})
	})
	fs.writeFileSync('./src/list.csv', doc,'utf8')
})

app.listen(process.env.PORT, () => {
  	console.log(`http://localhost:${process.env.PORT}`)
})