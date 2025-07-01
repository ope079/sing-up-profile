const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const mailchimp = require("@mailchimp/mailchimp_marketing");
const serverless = require("serverless-http")

mailchimp.setConfig({
  apiKey: process.env.apiKey,
  server: "YOUR_SERVER_PREFIX",
});


app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", function(req, res){

    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req,res){
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data)
    const list_id = "0473508d50"
    const url = "https://us3.api.mailchimp.com/3.0/lists/"+list_id;
    const options = {
        method: "POST",
        auth: process.env.apiKey,

    }

    const request = https.request(url, options, function(response){
        responseCode = response.statusCode;
        
        if (responseCode === 200)
            res.sendFile(__dirname + "/success.html")
        res.sendFile(__dirname + "/failure.html")
        
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
        
    })
    // request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){    
    res.redirect("/")
})

// app.listen(process.env.POST || 3000, function(){
//     console.log("Server is running on Port 3000")
// })

module.exports.handler = serverless('/', app);