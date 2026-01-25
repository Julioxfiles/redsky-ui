
## .htaccess

When working in Apache xampp in local. You will need the following two files.

Location: myrootProyect/.htaccess
```
RewriteEngine On
RewriteRule ^(.*)$ public/$1 [L]
```

Location: myrootProyect/public/.htaccess

```

```
