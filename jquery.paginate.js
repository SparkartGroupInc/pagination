!5
 * Storyteller Pagination Plug-in 0.0.1
 * @requires jQuery
 *
 * Present aggregated content as a single blended and paginated stream.
 * 
 * This plugin is available under the MIT License (Expat).
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright © 2013 Story Arc Corporation · storytellerhq.com
 */
(function( $, undefined ) {


	/**
	 * Resource
	 *
	 * A simple encapsulation.
	 */

	var Resource = function( url, data ) {
		this.url = url;
		this.data = data;
	};

	Resource.prototype = {

		/**
		 * Resource#get( data ) -> Deferred
		 */
		get: function( data ) {
			return $.get( this.url, $.extend( {}, this.data, data ));
		}
	};


	/**
	 * Pagination
	 *
	 * Extends resource with .next().
	 */

	var Pagination = function( resource, attributes ) {
		this.resource = resource;
		this.attributes = attributes || {};
		this.parameter = attributes.parameter;
		resource.next = $.proxy( this.next, this );
	};

	/**
	 * CursoringPagination
	 */

	var CursoringPagination = function( resource, attributes ) {
		// Pagination super
		Pagination.apply( this, arguments );
	};

	CursoringPagination.prototype = {};

	/**
	 * IndexOffsetPagination
	 */

	var IndexOffsetPagination = function( resource, attributes ) {
		// Pagination super
		Pagination.apply( this, arguments );
		this.offset = attributes.offset || 0;
		this.limit = attributes.limit;
	};

	IndexOffsetPagination.prototype = {

		/**
		 * IndexOffsetPagination#data() -> Object
		 */
		data: function() {
			var data = {};
			var parameterNames = this.attributes.parameterNames;
			data[ parameterNames.offset ] = this.offset;
			data[ parameterNames.limit ] = this.limit;
			return data;
		},

		/**
		 * IndexOffsetPagination#next() -> Deferred
		 */
		next: function() {
			var self = this;
			return this.resource.get( this.data() ).pipe(function( data ) {
				self.offset += 1; // FIXME This should be the post number to start at! But, we need to normalize data result, or delegate it to user code to figure out.
				return data;
			});
		}
	};

	/**
	 * PagePagination
	 */

	var PagePagination = function( resource, attributes ) {
		// Pagination super
		Pagination.apply( this, arguments );
	};

	PagePagination.prototype = {};

	/**
	 * TokenPagination
	 */

	var TokenPagination = function( resource, attributes ) {
		// Pagination super
		Pagination.apply( this, arguments );
	};

	TokenPagination.prototype = {};


	/**
	 * PaginatePlugin
	 */

	var paginations = {
		"cursoring": CursoringPagination,
		"index-offset": IndexOffsetPagination,
		"page": PagePagination,
		"token": TokenPagination
	};

	var PaginatePlugin = function() {};


	/**
	 * $.fn.paginate
	 */

	$.fn.paginate = function( attributes ) {
		this.each(function() {
			PaginatePlugin( this, attributes );
		});
		return this;
	};

})( jQuery );