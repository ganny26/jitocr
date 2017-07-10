var config = {
  production: {
    host:'https://tesseracth.herokuapp.com',
    port:process.env.PORT
  },
  default: {
   host:'localhost',
   port:'3000'
  }
}

exports.get = function get(env) {
  return config[env] || config.default;
}