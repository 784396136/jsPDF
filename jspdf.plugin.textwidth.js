
( function ( API ) {
	API.getTextWidth = function ( text, fontOptions ) {
		var txtWidth;
		// Get current font size
		fontOptions.fontSize = fontOptions.fontSize || this.internal.getFontSize();

		if ( typeof text === 'string' && text.match( /[\n\r]/ ) ) {
			text = text.split( /\r\n|\r|\n/g );
		}
		if ( text instanceof Array ) {
			
			// The passed in x coordinate defines the
			// desired center point for the text.
			var	lineWidths = text.map( function( v ) { 
					return this.getCharWidthTestArray( v ) * fontSize / this.internal.scaleFactor;
				}, this );
			txtWidth = Math.max.apply( Math, lineWidths );				
			
		} else {
			// Get the actual text's width
			/* You multiply the unit width of your string by your font size and divide
			 * by the internal scale factor. The division is necessary
			 * for the case where you use units other than 'pt' in the constructor
			 * of jsPDF.
			*/
			txtWidth = this.getCharWidthTestArray( text ) * fontSize / this.internal.scaleFactor;			
		}
		
		function getCharWidthTestArray( text, options ) {
			if ( !options ) {
				options = {};
			}
			var font = this.internal.getFont( options.font, options.style );
			var widths = font.metadata.Unicode.widths
			, widthsFractionOf = widths.fof ? widths.fof : 1
			, kerning = font.metadata.Unicode.kerning
			, kerningFractionOf = kerning.fof ? kerning.fof : 1;
			// console.log("widths, kergnings", widths, kerning)
			var i, l
			, char_code
			, prior_char_code = 0 // for kerning
			, default_char_width = widths[0] || widthsFractionOf
			, output = [];
			for ( i = 0, l = text.length; i < l; i++ ) {
				char_code = text.charCodeAt( i );
				output.push(
				( widths[char_code] || default_char_width ) / widthsFractionOf +
				( kerning[char_code] && kerning[char_code][prior_char_code] || 0 ) / kerningFractionOf
				);
				prior_char_code = char_code;
			}
			return getArraySum( output );
		}
		return txtWidth;		
	}
} )( jsPDF.API );