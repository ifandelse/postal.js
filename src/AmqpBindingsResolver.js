/*jshint -W098 */
/* global _postal, _config */
var keyDelimiter = _config.cacheKeyDelimiter;

var bindingsResolver = _config.resolver = {
	cache: {},
	regex: {},

	compare: function compare( binding, topic ) {
		var pattern;
		var rgx;
		var prevSegment;
		var cacheKey = topic + keyDelimiter + binding;
		var result = ( this.cache[ cacheKey ] );
		// result is cached?
		if ( result === true ) {
			return result;
		}
		// plain string matching?
		if ( binding.indexOf( "#" ) === -1 && binding.indexOf( "*" ) === -1 ) {
			result = this.cache[ cacheKey ] = ( topic === binding );
			return result;
		}
		// ah, regex matching, then
		if ( !( rgx = this.regex[ binding ] ) ) {
			pattern = "^" + _.map( binding.split( "." ), function mapTopicBinding( segment ) {
					var res = "";
					if ( !!prevSegment ) {
						res = prevSegment !== "#" ? "\\.\\b" : "\\b";
					}
					if ( segment === "#" ) {
						res += "[\\s\\S]*";
					} else if ( segment === "*" ) {
						res += "[^.]+";
					} else {
						res += segment;
					}
					prevSegment = segment;
					return res;
				} ).join( "" ) + "$";
			rgx = this.regex[ binding ] = new RegExp( pattern );
		}
		result = this.cache[ cacheKey ] = rgx.test( topic );
		return result;
	},

	reset: function reset() {
		this.cache = {};
		this.regex = {};
	},

	purge: function( options ) {
		var matchPredicate = function( val, key ) {
			var split = key.split( _config.cacheKeyDelimiter );
			var topic = split[ 0 ];
			var binding = split[ 1 ];
			if ( ( !options.topic || options.topic === topic ) &&
					( !options.binding || options.binding === binding ) ) {
				delete this.cache[ key ];
			}
		};

		var compactPredicate = function( val, key ) {
			var split = key.split( "-" );
			if ( _postal.getSubscribersFor( { topic: split[ 0 ] } ).length === 0 ) {
				delete this.cache[ key ];
			}
		};

		if ( !options ) {
			this.reset();
		} else {
			_.each( this.cache, options.compact ? compactPredicate : matchPredicate, this );
		}
	}
};
