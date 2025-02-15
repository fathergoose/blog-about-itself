# A blog about itself

## Directory Structure

```plaintext
.
├── bin            - Scripts for building the project
├── src            - Source files
│   ├── articles   - Main site contetnt in markdown files
│   │   ├── drafts - Articles not to be copied/published
│   │   └── public - Articles to be built into html pages
│   ├── static     = Favicons, 404 page, robots.txt etc.
│   ├── styles     - Source for stylesheets copied to www/styles
│   └── templates  = Html page boilerplate
└── www            - Destination for built pages, static files, and css
```

## Goals

### Round 1

- [x] Compose articles like code in markdown
- [x] Build process to transform markdown to html nodes
- [x] Build process to combine markdown output into full documents
- [x] Simple CSS
- [x] Document the build process
- [ ] An article describing what I've done

### Extras

- [ ] Full Minification
- [ ] Dev and Prod builds?
