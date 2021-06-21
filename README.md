# Starcoin 开发者网站

### PreRequirement

1. Install [hugo](https://gohugo.io/getting-started/installing/) > 0.68.0

### Checkout

```shell script
git clone https://github.com/starcoinorg/starcoin
git submodule update --init
```


### Run server
```
hugo server --minify --port 8004
```
open http://localhost:8004/ in browser


### test publish in localhost

1. edit `config.toml`:
change 
baseURL = "https://developer.starcoin.org/"

to

baseURL = "http://localhost:8004/"


2. generate public folder
hugo -s . --minify

3. serve pubic folder as static site
cd public
serve ./public -l 8004

4. open `http://localhost:8004` in browser


### Publish
- 项目根目录执行`hugo`即可编译静态文件，编译后在根目录生成`public`文件夹，将public部署至指定地点即可直接访问。
- 注：编译前修改`config.toml`中baseURL参数对应当前环境域名。
