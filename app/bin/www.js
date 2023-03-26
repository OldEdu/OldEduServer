"use strict"

const app = require("../app");
const PORT =process.env.PORT||8080;

app.listen(PORT,async ()=>{
    console.log(`Server is running on PORT ${PORT}.`);
})
