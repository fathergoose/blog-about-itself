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

```
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
that running `echo` with `-e` makes it interepet `\n` as the newline escape sequence
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
