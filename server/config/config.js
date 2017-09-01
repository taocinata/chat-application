const env = process.env.NODE_ENV || "development";
console.log("env ******",env);

if(env ==="test" || env==="development"){
    const config = require('./config.json');
    const configEnv = config[env];

    Object.keys(configEnv).forEach((key)=>{
        process.env[key]=configEnv[key];
    })
}