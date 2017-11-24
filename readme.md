# An Advanced Gulpfile

This repository is the full code accompanying the post on my blog *[Advanced Gulpfile](https://www.mikestreety.co.uk/blog/advanced-gulp-file)*.

The repo contains the following files:

- `bower.json` - this pulls in [Luigi](https://github.com/bozboz/luigi), a Sass framework from Bozboz
- `package.json` - this includes all the gulp plugins required by the gulp file
- `gulpfile.js` - the real reason you’re here.

The gulp file includes SCSS compilation and compression, JS concatenation and a sprite creation task. A full explanation of all the code can be found in the [blog post](https://www.mikestreety.co.uk/blog/advanced-gulp-file).

### Gulp with SVGs and Sprites

One of the updates to my gulp process is generating SVG sprites. I have written a separate blog post detailing this workflow on the Liquid Light blog - [Creating SVG Sprites using Gulp](https://www.liquidlight.co.uk/blog/article/creating-svg-sprites-using-gulp-and-sass/)

#### Outdated

Please note this gulpfile is a few years old and, as such, some of the syntax will be out of date. I will try and keep a note of the things below but please proceed with caution

- `gulp-sass` - [related issue](https://github.com/mikestreety/gulp/issues/5) for more details_
