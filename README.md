# api-docs
API Documentation

```sh
eval $(cat .env | sed 's/^/export /') && envsubst < .env.js.tpl > public/static/js/env.js
```