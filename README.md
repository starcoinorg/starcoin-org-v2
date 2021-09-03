# Starcoin 开发者网站

### Pre-Requirement

1. Install [hugo](https://gohugo.io/getting-started/installing/) > 0.68.0

### Checkout

```shell script
git clone https://github.com/starcoinorg/starcoin-org-v2.git
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
open `http://localhost:8004/` in browser

Note: if the site does not update with changes, try to open the Chrome/Safari console, and press Ctrl+R to forcibly reload the static files.


### Test publishing in localhost

1. generate public folder
```
./build.sh
```

2. serve pubic folder as static site
```
serve ./public -l 8004
```

3. open `http://localhost:8004` in browser

### Build and deploy to AWS S3 bucket
```
./publish.sh
```

### References
1. [install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)

2. [setup AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-creds)

3.[Using GitHub Actions and Hugo Deploy to Deploy a Static Site to AWS](https://capgemini.github.io/development/Using-GitHub-Actions-and-Hugo-Deploy-to-Deploy-to-AWS/)
