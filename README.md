# Starcoin 开发者网站

### PreRequirement

1. Install [hugo](https://gohugo.io/getting-started/installing/) > 0.68.0

### Checkout

```shell script
git clone https://github.com/starcoinorg/starcoin
git submodule update --init
```


### Run server
> `--minify` will change scale in html header meta value from 1.0 to 1:
> <meta content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0" name="viewport" />
> to 
> <meta content="width=device-width;initial-scale=1;maximum-scale=1;user-scalable=0" name="viewport" />
> which will cause resonsive layout bug in phone.

```
hugo server --port 8004
```
open http://localhost:8004/ in browser


### Test publish in localhost

1. generate public folder
./build.sh

2. serve pubic folder as static site
serve ./public -l 8004

3. open `http://localhost:8004` in browser

### Build and deploy to AWS S3 bucket
```
./publish.sh
```
> need to install AWS cli and config authentication first.
