/*! email-autocomplete-vanilla 0.1.3.3
 * MIT License
 * (c) 2023 Gakuto Matsumura (http://github.com/GakutoMatsumura)
 * Based on the email-autocomplete(0.1.3) library created by:
 * (c) 2014 Low Yong Zhen <yz@stargate.io>
*/
"use strict";

(function (window, document) {
	function EmailAutocompleteVanilla(obj, options) {
		if (!obj) {
			console.error("eac,const:C00");
			return;
		}
		var defaults = {
			suggClass: "eac-sugg",
			// renew. Mail client domains of world share 0.1.3.3
			domains: ["gmail.com","icloud.com","outlook.com","yahoo.com","hotmail.com","aol.com","live.com","msn.com","protonmail.com","me.com","mac.com","googlemail.com","facebook.com","gmx.com","zoho.com"]
		};
		this._f = obj;
		this._o = Object.assign({}, defaults, options);
		this._d = this._o.domains;
		this.init();
	}

	EmailAutocompleteVanilla.prototype = {
		init: function () {
			try {
				//shim indexOf
				if (!Array.prototype.indexOf) this.doIndexOf();

				//this will be calculated upon keyup
				this._flo = null;

				var field_obj = this._f;
				const field_style = getComputedStyle(field_obj || {});
				if (!Object.keys(field_style).length || !field_obj.parentNode) {
					console.error('eac,init:Object null');
					return;
				}

				//wrap our field
				var wrap = document.createElement("div");
				wrap.className = "eac-input-wrap";
				if (wrap.style) {
					wrap.style.display = field_style.display;
					wrap.style.position = (field_style.position === "static" ? "relative" : field_style.position);
					wrap.style.fontSize = field_style.fontSize;
					wrap.style.width = field_style.width;
				}

				field_obj.parentNode.insertBefore(wrap, field_obj);
				wrap.appendChild(field_obj);

				//create container to test width of current val
				this._cv = document.createElement("span");
				var cval_obj = this._cv;
				cval_obj.className = "eac-cval";
				var cval_style = cval_obj.style || {};
				cval_style.visibility = "hidden";
				cval_style.position = "absolute";
				cval_style.display = "inline-block";
				cval_style.fontFamily = field_style.fontFamily;
				cval_style.fontWeight = field_style.fontWeight;
				cval_style.letterSpacing = field_style.letterSpacing;
				field_obj.parentNode.insertBefore(cval_obj, field_obj.nextSibling);

				//create the suggestion overlay
				this._so = document.createElement("span");
				var suggest_overlay_obj = this._so;
				if (this._o)  suggest_overlay_obj.className = this._o.suggClass;
				var suggest_overlay_style = suggest_overlay_obj.style || {};
				suggest_overlay_style.display = "block";
				suggest_overlay_style.boxSizing = "content-box";
				suggest_overlay_style.lineHeight = field_style.lineHeight;

				// paddingTop to marginTop
				suggest_overlay_style.marginTop = parseFloat(field_style.marginTop) + parseFloat(field_style.paddingTop) + ((parseFloat(field_obj.offsetHeight) - parseFloat(field_obj.clientHeight)) / 2) + 'px';
				suggest_overlay_style.marginLeft = field_style.marginLeft;
				suggest_overlay_style.marginBottom = suggest_overlay_style.marginTop;
				suggest_overlay_style.fontFamily = field_style.fontFamily;
				suggest_overlay_style.fontWeight = field_style.fontWeight;
				suggest_overlay_style.letterSpacing = field_style.letterSpacing;
				suggest_overlay_style.position = "absolute";
				suggest_overlay_style.top = "0";
				suggest_overlay_style.left = "0";

				field_obj.parentNode.insertBefore(this._so, field_obj.nextSibling);

				//bind events and handlers (Enter key add)
				field_obj.addEventListener("keyup", this.displaySuggestion.bind(this));
				field_obj.addEventListener("blur", this.autocomplete.bind(this));
				field_obj.addEventListener("keydown", (function (e) { if (e.which === 13/*Enter*/ || e.which === 39/*→*/ || e.which === 9/*Tab*/) this.autocomplete(); }).bind(this));

				suggest_overlay_obj.addEventListener("mousedown", this.autocomplete.bind(this));
				suggest_overlay_obj.addEventListener("touchstart", this.autocomplete.bind(this));
			} catch (e) {
				console.error('eac,init:', e);
			}
		},
		suggest: function (str) {
			if (!str || !this._d || !Array.isArray(this._d)) {
				return "";
			}

			var str_arr = str.split("@");
			if (str_arr.length > 1) {
				str = str_arr.pop();
				if (!str.length) {
					return "";
				}
			}
			else {
				return "";
			}

			var match = this._d.filter(function (domain) {
				return domain.indexOf(str) === 0;
			}).shift() || "";

			return match ? match.replace(str, "") : "";
		},

		autocomplete: function () {
			if (!this._s || this._s.length < 1 || !this._v) {
				return false;
			}
			if (this._f) this._f.value = this._v + this._s;
			if (this._so) this._so.textContent = "";
			if (this._cv) this._cv.textContent = "";
			return true;
		},

		/**
		 * Displays the suggestion, handler for field keyup event
		 */
		displaySuggestion: function (e) {
			this._v = (this._f ? this._f.value : '');
			this._s = this.suggest(this._v);

			if (!this._s.length) {
				this._so.textContent = "";
			} else {
				e.preventDefault();
			}

			//update with new suggestion
			if (this._so) this._so.textContent = this._s;
			if (this._cv) this._cv.textContent = this._v;

			// get input padding, border and margin to offset text
			if (this._flo === null) {
				const style = (this._f && getComputedStyle(this._f)) || {};
				this._flo = (parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth)) || 0;
			}

			//left position suggestion text
			var left = parseFloat(this._flo) + parseFloat(this._cv && this._cv.getBoundingClientRect ? this._cv.getBoundingClientRect().width : 0);
			if (!isNaN(left)) {
				this._so.style.left = left + "px";
			}
		},

		/**
		 * indexof polyfill
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
		*/
		doIndexOf: function () {
			Array.prototype.indexOf = function (searchElement, fromIndex) {
				if (this === undefined || this === null) {
					throw new TypeError('"this" is null or not defined');
				}

				var length = this.length >>> 0; // Hack to convert object.length to a UInt32

				fromIndex = +fromIndex || 0;

				if (Math.abs(fromIndex) === Infinity) {
					fromIndex = 0;
				}

				if (fromIndex < 0) {
					fromIndex += length;
					if (fromIndex < 0) {
						fromIndex = 0;
					}
				}

				for (; fromIndex < length; ++fromIndex) {
					if (this[fromIndex] === searchElement) {
						return fromIndex;
					}
				}
				return -1;
			};
		}
	};

	window.emailautocomplete = function (selector, options) {
		var elems = document.querySelectorAll(selector);
		var instances = [];
		if (elems) {
			for (var i = 0; i < elems.length; ++i) {
				if (!elems[i].dataset.eac) {
					instances.push(new EmailAutocompleteVanilla(elems[i], options));
					elems[i].dataset.eac = true;
				}
			}
		}
		return instances;
	};

})(window, document);