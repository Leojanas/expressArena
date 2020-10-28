const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheese burgers!');
})

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way!');
})

app.get('/pizza/pineapple', (req, res) => {
    res.send("We don't serve that here, never call again!");
})

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
        Base URL: ${req.baseUrl}
        Host: ${req.hostname}
        Path: ${req.path}
    `;
    res.send(responseText)
})

app.get('/queryViewer', (req,res) => {
    console.log(req.query);
    res.end()
})

app.get('/greetings', (req,res) => {
    const name = req.query.name;
    const race = req.query.race;
    if(!name) {
        return res.status(400).send('Name was not provided.')
    }
    if (!race) {
        return res.status(400).send('Race was not provided.')
    }
    const greeting = `Greetings, ${name} the ${race}. Welcome to our kingdom.`;

    res.send(greeting);
})

app.get('/sum', (req,res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    
    if(!a){
        return res.status(400).send('a was not provided or was not a number.');
    }
    if(!b){
        return res.status(400).send('b was not provided or was not a number.');
    }
    const c = a + b;
    res.send(`The sum of ${a} and ${b} is: ${c}`);
})

app.get('/cipher', (req,res) => {
    const text = req.query.text;
    const shift = parseInt(req.query.shift);
    if(!text){
        return res.status(400).send('No text was provided to cipher.');
    }
    if(!shift){
        return res.status(400).send('No shift was provided or it was not a number.');
    }
    let textArray = text
    .toUpperCase()
    .split('');
    let cipher = textArray.map(char => {
        let code = char.charCodeAt(0);
        if (code < 65 || code > 90){
            return String.fromCharCode(code)
        }else{
            code = code + shift;
        }
        if(code > 90){
            code = 64 + (code - 90);
            return String.fromCharCode(code)
        }else{
            return String.fromCharCode(code)
        }
    })
    cipher = cipher.join('');
    res.send(`Original text '${text}' becomes new text: '${cipher}'.`);
})

app.get('/lotto', (req,res) => {
    const numbers = req.query.numbers;
    if(numbers.length !== 6){
        return res.status(400).send('Exactly six numbers are required.')
    }
    for(let i=0; i < numbers.length; i++){
        if (parseInt(numbers[i]) == numbers[i]){
            if(numbers[i] > 0 && numbers[i] < 21){

            }else{
                return res.status(400).send('Numbers must be between 1 and 20 inclusive.')
            }
        }else{
            return res.status(400).send('Numbers must be integers.')
        }
    }
    const random = [];
    for(let i=0; i < 6; i++){
        let number = Math.floor(Math.random()*19) + 1;
        if(random.includes(number)){
            i = i-1;
        }else{
            random[i] = number;
        }
    }
    let match = 0;
    for(let i=0; i < 6; i++){
        if(random.includes(parseInt(numbers[i]))){
            match = match + 1;
        }
    }
    if(match === 6){
        return res.status(200).send('Wow! Unbelievable! You could have won the mega millions!')
    }else if(match === 5){
        return res.status(200).send(`Congratulations! You win $100. Winning numbers were ${random}`)
    }else if(match === 4){
        return res.status(200).send(`Congratulations, you win a free ticket. Winning numbers were ${random}`)
    }else{
        return res.status(200).send(`Sorry, you lose. Only ${match} of your numbers were drawn. Winning numbers were ${random}`)
    }
})