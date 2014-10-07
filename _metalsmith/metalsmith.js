var Nunjucks = require( 'nunjucks' );
var Path = require( 'path' );
var marked = require( 'marked' );
var metalsmith = require( 'metalsmith' );
var YAML = require( 'libyaml' );
var exec = require('child_process').exec;
var Prism = require( 'prismjs' );
var HtmlSave = require( 'htmlsave' );
var Sass = require( 'node-sass' );

var isMarkdown = function ( file ) {
    return /\.md|\.markdown/.test( Path.extname( file ) ); };

var isSass = function ( file ) {
    return /\.scss/.test( Path.extname( file ) ); };

var isData = function ( file ) {
    return /\.ya?ml/.test( Path.extname( file ) ); };

var isHtml = function ( file ) {
    return /\.html?/.test( Path.extname( file ) ); };

var isTemplate = function ( file ) {
    return /\.jinja/.test( Path.extname( file ) ); };

Prism.languages.esnext = Prism.languages.extend( 'javascript', {
    'keyword': {
        pattern: /(^|[^.])\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield|constructor|from)\b/g,
        lookbehind: true
    }
} );

Prism.languages.insertBefore( 'esnext', 'string', {
    'template': {
        pattern: /(^|[^\\])(`[\w\W]*?`|(^|[^:])\/\/.*?(\r?\n|$))/g,
        lookbehind: true,
        inside: {
            interpolate: /(\$\{[^}]*\})/g
        }
    }
} );

var highlightCode = function ( code, language ) {

    var hl = Prism.highlight( code, Prism.languages.esnext );

    return HtmlSave.slice( hl, hl.split( /\n/g ).map( function ( line ) {
        return line.replace( /(<([^>]+)>)/ig, '' ).length + 1;
    } ) ).map( function ( line ) {
        var nocr = line.replace( /\n/g, '' );
        return '<span class="line">' + nocr + '</span>';
    } ).join( '' );

};

marked.setOptions( {

    highlight : function ( code, language ) {
        return highlightCode( code, language );
    }

} );

var markedRenderer = new marked.Renderer( );

markedRenderer.heading = function ( text, level, raw ) {

    var slug = this.options.headerPrefix + raw.toLowerCase( ).replace( /[^\w]+/g, '-' );
    var before = '', after = '';

    if ( level === 1 ) {
        before = '<div class="page-header">';
        after = '</div>';
    }

    return before + '<h' + level + ' id="' + slug + '">'
        + text
    + '</h' + level + '>' + after;

};

markedRenderer.table = function ( head, body ) {

    return '<table class="table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>';

};

markedRenderer.code = function ( body, lang ) {

    body = this.options.highlight( body, lang );

    return '<pre><code>' + body + '</code></pre>';

};

var nunjucksEnvironment = Nunjucks.configure( __dirname + '/content/_templates', {
    autoescape : true
} );

nunjucksEnvironment.addFilter( 'is_iterable', function ( o ) {

    return typeof o === 'object';

} );

nunjucksEnvironment.addFilter( 'slugify', function ( value ) {

    return ( '' + value ).toLowerCase( ).replace( /(^[^a-z]|[^a-z]$)/g, '' ).replace( /[^a-z]+/g, '-' );

} );

nunjucksEnvironment.addFilter( 'highlight', function ( code, language ) {

    return highlightCode( code, language );

} );

metalsmith( __dirname )

    .source( 'content' )
    .destination( '..' )

    .clean( false )

    .use( function ( files, metalsmith, done ) {
        // Manual clean to preserve .git, virtjs and _metalsmith
        exec( "find .. -maxdepth 1 -not \\( -name 'CNAME' -o -name 'virtjs' -o -name '_*' -o -name '.*' \\) -exec rm -r {} \\;", function ( error, stdout, stderr ) {
            done( );
        } );
    } )

    .use( function ( files, metalsmith, done ) {
        setImmediate( done );
        files.data = { };
        Object.keys( files ).forEach( function ( file ) {

            if ( ! isData( file ) )
                return ;

            var base = Path.basename( file, Path.extname( file ) );
            var content = files[ file ].contents.toString( );
            var data = YAML.parse( content )[ 0 ];

            files.data[ base ] = data;

        } );
    } )

    .use( function ( files, metalsmith, done ) {
        setImmediate( done );
        Object.keys( files ).forEach( function ( file ) {

            if ( ! isMarkdown( file ) )
                return ;

            var dir = Path.dirname( file );
            var base = Path.basename( file, Path.extname( file ) );
            var out = Path.join( dir, base + '.html' );

            var content = files[ file ].contents.toString( );
            var html = marked( content, { renderer : markedRenderer } );

            files[ out ] = files[ file ];
            files[ out ].contents = new Buffer( html );
            delete files[ file ];

        } );
    } )

    .use( function ( files, metalsmith, done ) {
        setImmediate( done );
        Object.keys( files ).forEach( function ( file, done ) {

            if ( ! isHtml( file ) || ! files[ file ].layout )
                return ;

            var data = { };

            Object.keys( files.data ).forEach( function ( key ) {
                data[ key ] = files.data[ key ]; } );

            data.meta = files[ file ];
            data.body = files[ file ].contents;

            var content = files[ '_templates/layouts/' + files[ file ].layout + '.jinja' ].contents.toString( );
            var html = Nunjucks.renderString( content, data );

            files[ file ].contents = new Buffer( html );

        } );
    } )

    .use( function ( files, metalsmith, done ) {
        setImmediate( done );
        Object.keys( files ).forEach( function ( file ) {

            var parts = file.split( /\//g );

            var arePrivate = function ( part ) {
                return part[ 0 ] === '_'; };

            if ( parts.some( arePrivate ) ) {
                delete files[ file ];
            }

        } );
    } )

    .use( function ( files, metalsmith, done ) {
        setImmediate( done );
        Object.keys( files ).forEach( function ( file, done ) {

            if ( ! isTemplate( file ) )
                return ;

            var dir = Path.dirname( file );
            var base = Path.basename( file, Path.extname( file ) );
            var out = Path.join( dir, base + ( base.indexOf( '.' ) === -1 ? '.html' : '' ) );

            var data = { };

            Object.keys( files.data ).forEach( function ( key ) {
                data[ key ] = files.data[ key ]; } );

            data.meta = files[ file ];

            var content = files[ file ].contents.toString( );
            var html = Nunjucks.renderString( content, data );

            files[ out ] = files[ file ];
            files[ out ].contents = new Buffer( html );
            delete files[ file ];

        } );
    } )

    .use( function ( files, metalsmith, done ) {
        setImmediate( done );
        delete files.data;
    } )

    .use( function ( files, metalsmith, done ) {
        setImmediate( done );
        Object.keys( files ).forEach( function ( file ) {

            if ( ! isSass( file ) )
                return ;

            var dir = Path.dirname( file );
            var base = Path.basename( file, Path.extname( file ) );
            var out = Path.join( dir, base + '.css' );

            var css = Sass.renderSync( {
                data : files[ file ].contents.toString( ),
                includePaths : [ Path.join( metalsmith.source( ), dir ) ]
            } );

            files[ out ] = files[ file ];
            files[ out ].contents = new Buffer( css );
            delete files[ file ];

        }.bind( this ) );
    } )

    .use( function ( files, metalsmith, done ) {
        setImmediate( done );
        Object.keys( files ).forEach( function ( file ) {

            if ( ! isHtml( file ) )
                return ;

            var dir = Path.dirname( file );
            var base = Path.basename( file, Path.extname( file ) );

            if ( base === 'index' )
                return ;

            var out = Path.join( dir, base, 'index.html' );

            files[ out ] = files[ file ];
            delete files[ file ];

        } );
    } )

.build( function ( err ) {

    if ( ! err )
        return ;

    throw err;

} );
