open bash from the terminal dropdown
by typing below get the JWT_SECRET=
$ openssl rand -base64 32
mU7btokCWhxPG8dGXAirfT+FP+dK5BuLgNUo40JVJDs=

node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
