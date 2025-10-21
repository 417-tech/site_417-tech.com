# Site - https://417-tech.com

Public page for 417 Tech, built with [11ty](https://www.11ty.dev).

### Deploy Steps

For this, you will need NodeJS. I used the latest Docker container during building which used `v25.0.0`.

```none
# Clone the repository
git clone https://github.com/417-tech/site_417-tech.com.git

# Enter the directory
cd site_417-tech.com

# Install dependencies
npm install

# Build the site
npx @11ty/eleventy
```

The resulting site will be built in `_site`, which can be packaged and deployed as a static site wherever necessary.
