const fs = require('fs')
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const fileStorage = require("./fileStorage")
const { get } = require('http')

//Henter lagrede data
const data = fileStorage.loadData();

const svarTabell = data.svarTabell;

//Starter opp express, og skrur på public-mappen
const app = express()
const publicDirectoryPath = path.join(__dirname, "../public")
app.use(express.static(publicDirectoryPath))

//lar oss få tilgang til bodyobjectet til en post request
app.use(express.urlencoded({extended: true}))

//Legger til Handlebars for å få til Server Side Rendering
const viewPath = path.join(__dirname, "../views/pages")
const partialsPath = path.join(__dirname, "../views/partials")
app.set("view engine", hbs)
app.set('views',viewPath)
hbs.registerPartials(partialsPath)

//Funksjon (handler) for å vise fremsiden
function hovedSideRute(request, response){
    response.render("index.html", {
        
    })
}


function listeSideRute(request, response){
    let slemTeller = 0;
    //En for løkke som går gjennom data.svartabell og sier if slem === "Slem" slemteller ++
    for (let i = 0; i < data.svarTabell.length; i++) {
        if (data.svarTabell[i].oppforsel === "Slem") {
          slemTeller++;
        }
    }

    response.render("liste.hbs", {
       svarTabell: data.svarTabell,
       ppl: svarTabell.length,
       slem: slemTeller
    })

}

function snillSideRute(request, response){
    response.render("snill.hbs", {
        svarTabell: data.svarTabell,
    })
}

function surSideRute(request, response){
    response.render("sur.hbs", {
        svarTabell: data.svarTabell,
    })
}


function sendInn(request, response) {
    const svar = request.body;
    const random = Math.random();
        if (random < 0.25)  {
            svar.oppforsel = "Slem"
        }
    
        if ( svar.oppforsel === "Slem") {
            response.render("sur.hbs", svar)
            svar.onsker = ["Kull"];
            
        } if (svar.oppforsel === "Snill") {
            response.render("snill.hbs", svar)
        }
        data.svarTabell.push(svar)
        fileStorage.storeData(data)
}

//Legge inn funksjonen hovedSideRute, slik at denne 
//vises når noen åpner "topp-domenet" vårt
app.get('',hovedSideRute);

app.get('/snill.hbs',snillSideRute);

app.get('/sur.hbs',surSideRute);

app.get('/liste.hbs',listeSideRute);

app.post("/sendinn", sendInn);

app.listen(3000, function() { 
    console.log("Server is up! Check http://localhost:3000")
})


