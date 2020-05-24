# Simple Bootstrap Template for CSS/HTML/JS Projects
---
>Modified from [gulp-start](https://github.com/codexysoft/gulp-start)

#### To Start:
1. Install [Node.js](https://nodejs.org/en/)
2. Install Gulp CLI `npm install gulp-cli -g`
3. Run `npm install` in project directory

#### Tasks:
1. `gulp` run all tasks to build dist folder
2. `gulp clean` removes dist folder
3. `gulp cb` removes dist folder and then builds the project
4. `gulp convertFonts`  convert ttf fonts to other formats

###### SCSS:
Compiles SCSS to a minified autoprefixed CSS

###### JS:
Minifies and uglifies JS files into bundle.js. node_modules path are included so you can use them with import like this:

```javascript
import 'bootstrap/js/dist/dropdown.js';
```
###### Fonts conversion:
For covertation fonts into the web formats put your ttf fonts in the src/assets/fonts/ directory and then run gulp convertFonts. It will be converted into woff2, woff and eot formats in the same directory.

###### HTML:
Changes imgs src paths from the htmls in the src folder to the paths in the dist.

###### Images:
Optimizes PNG, SVG and JPG images
