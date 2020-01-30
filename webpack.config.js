const path = require('path') //You don't need to NPM install 'path' because it's already part of the Node library

const postCSSPlugins = [
    require('postcss-import'), //PostCSS plugin that allows use of PostCss import syntax for css modules
    require('postcss-mixins'), //PostCSS plugin that allows use of PostCss mixins
    require('postcss-simple-vars'), //PostCSS plugin that allows use of PostCss variables
    require('postcss-nested'), //PostCSS plugin that allows use of nested PostCss
    require('autoprefixer') //PostCSS plugin to parse CSS and add vendor prefixes to CSS rules using values from Can I Use.
]

module.exports = {
    entry: './app/assets/scripts/App.js', //Entry point is App.js
    output: { //Output object specifies desired filename and the absolute path to the desired location.
        filename: 'bundled.js',
        path: path.resolve(__dirname, 'app') //In this example we're putting our output file, bundled.js, in our 'app' folder in the root directory. Webpack requires an absolute path for this syntax, which is why we can't simply say './app' so we use the native NPM 'path' library here. We pass __dirname, and 'app' to its resolve method. 
    },
    devServer: { //webpack-dev-server package specifications are set here in this object
        before: function(app, server) {
            server._watch('./app/**/*.html') //Here we're telling webpack-dev-server to also watch for any file that ends in .html
        },
        contentBase: path.join(__dirname, 'app'), //This is where we point to the folder or directory we want Webpack to serve up
        hot: true, //Hot set to true is hot reloading, which allows Webpack to inject our updated CSS or JavaScript into the browser on the fly without a manual refresh
        port: 3000, //This has a value of 8080 by default, I don't think it matters but 3000 is convention and easy to remember
        host: '0.0.0.0' //Adding host: '0.0.0.0' allows us to access the site as it's hosted on the webpack-dev-server from any device, most usefully a mobile device. On Mac, got to System Preferences > Network to get your Local IP (Example: 192.168.X.X). Entering this into the browser of another device on the same network will pull up the page.
    },
    mode: 'development', //You have to set mode to 'development' otherwise you'll get an annoying message in the terminal "The 'mode' option has not been set, Webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment..."

    /* 
    We no longer need the watch property below because setting hot: true in our webpack-dev-server configuration takes care of it for us. (In this project I had watch: true first and then did NPM install webpack-dev-server --save-dev)
    watch: true, //Everytime you save a change to the entry file Webpack will automatically update the output file (bundled.js in our case) without us having to keep running Webpack from the terminal via our script in package.json, i.e. npm run dev. Hit Control+C to stop the watch. So this webpack.config.js simply keeps running until we hit Control+c
    */
   
    module: { //Tell Webpack what do to when it runs into certain files by adding the module property, within which we need a rule property which is set to an array of rules...
        rules: [
            { // ...within the array, our first (and only) object's first property specifies the type of file with the test property, which is set to a RegEx that says 'only if the filename ends in .css', and the second property of the object, use, is set to an array which says to use the 'style-loader' and 'css-loader' packages from NPM. 'css-loader' tells Webpack to understand and process CSS files, and 'style-loader' applies and uses that CSS in the browser itself. Instead of just listing 'css-loader' we add '?url=false' to it to tell Webpack that we want to manage our image files manually. We also specify to use 'postcss-loader' which has its own way of being conveyed as an element in the use array. It's an object where the loader property is set to 'postcss-loader', and the options are set to an object that specifies an array of plugins. We set those plugins above on line 3 as a const and use them here.
                test: /\.css$/i,
                use: ['style-loader', 'css-loader?url=false', {loader: 'postcss-loader', options: {plugins: postCSSPlugins}}]
            }
        ]
    }
}