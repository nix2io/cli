# Alert Grammer

```

binop  :  name ((COMMA, LINK) name)*

name   :  string
       :  (EXCLUDE) name
       :  LPAR  rule  RPAR

```

### Examples

```js
service;

NAME('service');

service.me;

INDEX(NAME('service'), NAME('me'));

service.log.error;

INDEX(NAME('service'), INDEX(NAME('log'), NAME('error')));
```
