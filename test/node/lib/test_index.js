var assert  = require('assert');
var polyfillio = require('../../../lib/index');

describe("polyfillio", function() {
	describe(".getPolyfills(features)", function() {

		it("should remove features not appropriate for the current UA", function() {
			assert.deepEqual(polyfillio.getPolyfills({
				features: {
					'Array.prototype.map': { flags:[] }
				},
				uaString: 'chrome/38'
			}), {});
		});

		it("should respect the always flag", function() {
			assert.deepEqual(polyfillio.getPolyfills({
				features: {
					'Array.prototype.map': { flags:['always'] }
				},
				uaString: 'chrome/38'
			}), {
				'Array.prototype.map': { flags:['always'], polyfillVariant:'default' }
			});
		});

		it("should include dependencies", function() {
			assert.deepEqual(polyfillio.getPolyfills({
				features: {
					'Element.prototype.placeholder': { flags: [] }
				},
				uaString: 'ie/8'
			}), {
				'Element.prototype.placeholder': { flags:[], polyfillVariant:'default' },
				'Object.defineProperty': { flags:[], aliasOf: ['Element.prototype.placeholder'], polyfillVariant:'ie8' },
				'Element': { flags: [], aliasOf: ['Element.prototype.placeholder'], polyfillVariant: 'ie8' }
			});
		});

		it("should choose the right variant", function() {
			assert.deepEqual(polyfillio.getPolyfills({
				features: {
					'Math.sign': { flags: [] }
				},
				uaString: 'ie/7'
			}), {
				'Math.sign': { flags:[], polyfillVariant:'plus' }
			});
		});

		it("should return no polyfills for unknown UA unless unknown is set", function() {

			// Without unknown, no polyfills
			assert.deepEqual(polyfillio.getPolyfills({
				features: {'Math.sign': { flags: [] }},
				uaString: ''
			}), {});

			// With unknown=polyfill, default variant polyfills
			assert.deepEqual(polyfillio.getPolyfills({
				features: {'Math.sign': { flags: [] }},
				unknown: 'polyfill',
				uaString: ''
			}), {
				'Math.sign': { flags:[], polyfillVariant:'default' }
			});

			// With unknown=polyfill, default variant polyfills (UA not specified)
			assert.deepEqual(polyfillio.getPolyfills({
				features: {'Math.sign': { flags: [] }},
				unknown: 'polyfill',
			}), {
				'Math.sign': { flags:[], polyfillVariant:'default' }
			});
		});
	});

	/*
	// TODO: Not sure how to test this reliably - need a mock polyfill source?
	describe('.getPolyfillString', function() {

		it('should include the non-gated source when a feature-detect is unavailable', function() {
		});
	});
	*/
});
