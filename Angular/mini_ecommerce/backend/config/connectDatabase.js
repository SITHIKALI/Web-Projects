const mongoose = require('mongoose');
const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI).then((con) => {
        console.log(`Database connected successfully`+con.connection.host);
    })
};
module.exports=connectDatabase;