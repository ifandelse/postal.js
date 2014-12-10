/* global postal */
describe( "postal.js - publishing", function() {
	describe( "when publishing to a new topic", function() {
		it( "should create cache entry", function() {
			postal.cache.should.not.have.property( "Doctor|Dont.Blink" ); //jshint ignore:line
			postal.publish( {
				channel: "Doctor",
				topic: "Dont.Blink",
				data: { weeping: true }
			} );
			postal.cache.should.have.property( "Doctor|Dont.Blink" );
			postal.configuration.resolver.should.have.property( "Dont.Blink-Dont.Blink" );
		} );
	} );
} );
