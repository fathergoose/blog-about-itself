# Build a Simple, Static Blog with Markdown and Git

---

## Introduction

One of the best ways to learn something well is to make it yourself. Even
better to make it simple with classic ingredients. Tomato basil sauce? Maybe
later, but now let's look at how we can cook up a traditional static website
for our html web documents. Fire up your Gateway PC and let's write html like
it's 1998.

Well, maybe not '98 but we are going to keep things simple. The one "fancy"
feature requirement is that we will be able write our articles in markdown and
have them built into html pages.

---

## Setup

While there's not going to be any JavaScript on our web pages I'm going to use
Node to handle the site generation. Setup a new project and install markdown-it
to generate html from markdown files. We are also going to want a way to serve
out website while we are developing so also add http-server. I typically use
Typescript but that would just complicate things here. Prettier is always a
good option to keep us from fussing with formatting. You'll want to configure
your editor to use prettier to format your code on save to get the most value
out of it, but that's an article for another day.

```bash
mkdir blog-about-itself && cd blog-about-itself
echo '{}' > package.json
npm install --save-dev markdown-it http-server prettier
```

And since you aren't psychopath (or game developer) throw some git on as well.
We will need it later for deploying plus it'll allow me to share a couple
tricks for tracking 'empty' and 'ignored' directories.

```bash
git init
echo 'node_modules' > .gitignore
git add --all && git commit -m 'init'
```

This is the directory structure I went with. I trust you can `mkdir`s without my
help.

```txt
.
├── bin
└── src
    ├── articles
    │   ├── drafts
    │   └── public
    ├── static
    ├── styles
    └── templates
```

And last, but not least, lets create a dummy markdown file for testing. Note
that running `echo` with `-e` makes it interpret `\n` as the newline escape sequence
rather than literal backslash and "n" characters.

```bash
echo -e \
'# Build a Simple, Static Blog\n\nLorem ipsum...\n\n## Setup\n\nHello Web!' \
> src/articles/public/hello.md
```

You will likely want a more featured markdown test file for setting up styles
but that string will get us going for now. My original test file turned into
this article.

---

## Markdown to HTML

The driving intent behind this project was to minimize dependencies and
unnecessary complications. Sometimes those goals can be at odds with one
another. However, when in doubt I want to choose to avoid unnecessary
complication. For that reason I've chosen to rely on the third-party markdown
library [markdown-it](https://www.npmjs.com/package/markdown-it). I don't
remember why I chose markdown-it over marked, but I did and it's working just
fine for me so far.

```bash
npm install --save-dev markdown-it
```

Now we are able to do something like this to create our own html articles from
our markdown source.

```JavaScript
import markdownit from "markdown-it";
import { readFileSync, writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";

const data = readFileSync(mdFilePath, { encoding: "utf8" });
const md = markdownit();
const child = md.render(data);
const htmlData = new Uint8Array(Buffer.from(child));
writeFileSync(htmlFilePath, htmlData);
```

However, what we will get out of this isn't quite the web-ready html document we
may have been hoping for. We can add another step and insert our generated html
fragment into a larger html template file.

```JavaScript
import markdownit from "markdown-it";
import { readFileSync, writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";

function combineHtml(parentFile, childContent) {
  const parentContent = readFileSync(parentFile, "utf8");
  const result = parentContent.replace("{{___article_text___}}", childContent);
  return result;
}

const data = readFileSync(mdFilePath, { encoding: "utf8" });
const md = markdownit();
const child = md.render(data);
const resultHtml = combineHtml(templateFilePath, childContent);
const htmlData = new Uint8Array(Buffer.from(resultHtml));

writeFileSync(htmlFilePath, htmlData);
```

Here is an example of a simple html template file I've based this site off of.

```html
<!doctype html>
<html class="no-js" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title></title>
    <link rel="stylesheet" href="/css/style.css" />
    <meta name="description" content="" />

    <meta property="og:title" content="" />
    <meta property="og:type" content="" />
    <meta property="og:url" content="" />
    <meta property="og:image" content="" />
    <meta property="og:image:alt" content="" />

    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="icon.png" />

    <link rel="manifest" href="site.webmanifest" />
    <meta name="theme-color" content="#fafafa" />
  </head>

  <body>
    <div class="banner">
      <a href="/">Home</a>
      <a href="https://fathergoose.github.io">About</a>
      <a href="https://www.github.com/fathergoose/blog-about-itself">Source</a>
    </div>
    <div class="container">{{___article_text___}}</div>
  </body>
</html>
```

I got the html document boilerplate from
[html5boilerplate](https://html5boilerplate.com/). While I was there I copied
their css boilerplate and various static boilerplate files (e.g. `favicon.ico`,
`robots.txt`). I placed them in src/styles and src/static respectively.

## Copying Assets
