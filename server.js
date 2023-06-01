const express = require('express');
const truecallerjs = require('truecallerjs');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
    res.render('data', { name: "name", carrier: "carrier", city: "city", timezone: "timezone", email: "Email", code: "Dialing Code" });
});

app.post('/', (req, res) => {
    var new_number = Number(req.body.myfile);
    console.log(new_number);
    if (isNaN(new_number)) {
        res.redirect('https://icaller.herokuapp.com/');
    } else {
        let searchData = {
            number: req.body.myfile,
            countryCode: "IN",
            installationId: "a1i0B--YFvJq5-mVMgccpJGeu0qlV9di0kNNTn345hXlCPdPeSGVxNf_K6ICEk4_",
            output: "JSON"
        };
        let sn = truecallerjs.searchNumber(searchData);
        sn.then(function (response) {
            var obj = JSON.parse(response);
            let name = obj.data[0].name;
            let carrier = obj.data[0].phones[0].carrier;
            let dialingCode = obj.data[0].phones[0].dialingCode;
            let city = obj.data[0].addresses[0].city;
            let timeZone = obj.data[0].addresses[0].timeZone;
            try {
                const email = obj.data[0].internetAddresses[0].id;
                if (email == null) {
                    res.render('data', { name: name, carrier: carrier, city: city, timezone: timeZone, email: "No email provided", code: dialingCode });
                } else {
                    res.render('data', { name: name, carrier: carrier, city: city, timezone: timeZone, email: email, code: dialingCode });
                }
            } catch {
                res.render('data', { name: name, carrier: carrier, city: city, timezone: timeZone, email: "No data Provided", code: dialingCode });
            }
        });
    }
});
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log("app listening" + port);
});
