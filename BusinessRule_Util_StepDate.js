/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "Util_StepDate",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "StepDate",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
/*
* class StepDate: adapter class to Date STEP formats
* Dependency: none
* --------------------------------------------------------
*/
/* global java */

// Global object
function _GLOBAL() {
    this.isoDateTimeFormatter = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    this.isoDateFormatter = new java.text.SimpleDateFormat("yyyy-MM-dd");
}
var GLOBAL = new _GLOBAL();

/**
 * StepDate: adapter class to Date STEP formats
 * @class StepDate
 * @param {Integer} time is a date in ms
 */
function StepDate( time) {
	this.time = time;
}

/**
* Create a new StepDate from the current system date
* @exports newInstance as StepDate.newInstance
* @return {StepDate} The new StepDate object.
*/
function newInstance() {
    return new StepDate( java.lang.System.currentTimeMillis());
}

/**
* Create a new StepDate from a STEP ISO Date string
* @exports newFromIsoDateString as StepDate.newFromIsoDateString
* @param {String} isoDateValue the initial date value to setup
* @return {StepDate} The new StepDate object.
*/
function newFromIsoDateString( isoDateValue) {
    return new StepDate( GLOBAL.isoDateFormatter.parse( isoDateValue).getTime());
}

/**
* Create a new StepDate from a STEP ISODateTime string
* @exports newFromIsoDateTimeString as StepDate.newFromIsoDateTimeString
* @param {String} isoDateTimeValue the initial date value to setup
* @return {StepDate} The new StepDate object.
*/
function newFromIsoDateTimeString( isoDateTimeValue) {
    return new StepDate( GLOBAL.isoDateTimeFormatter.parse( isoDateTimeValue).getTime());
}

/**
 * clone this date object
 * @returns {StepDate} a new cloned StepDate object.
 */
StepDate.prototype.clone = function() {
    return new StepDate( this.time);
};

/**
 * returns this date in a readable string
* @return {String} the string value.
*/
StepDate.prototype.toString = function() { 
    return (new java.util.Date( this.time)).toString();
};

/**
 * returns this date in a Date object
* @return {Date} the string value.
*/
StepDate.prototype.asDateObject = function() { 
    return new java.util.Date( this.time);
};

/**
 * Returns the STEP ISODate value.
 * @return {String} the STEP ISODate value.
*/
StepDate.prototype.asIsoDate = function() { 
    return String( GLOBAL.isoDateFormatter.format( new java.util.Date( this.time)));
};

/**
 * Returns the STEP ISODateTime value.
 * @return {String} the STEP ISODateTime value.
*/
StepDate.prototype.asIsoDateTime = function() { 
    return String( GLOBAL.isoDateTimeFormatter.format( new java.util.Date( this.time)));
};

/**
 * Add a duration to the current StepDate
 * @param {number} duration is the time in ms
 */
StepDate.prototype.addDuration = function( duration) {
    this.time += duration;
};

/**
 * Substract a duration to the current StepDate
 * @param {number} duration is the time in ms
 */
StepDate.prototype.subDuration = function( duration) {
    this.time -= duration;
};

/**
 * Calculate a duration to reach a target date
 * @param {StepDate} targetStepDate is the target milestone 
 * @returns {number} the correspond duration to access the target (negative if this has overpassed)
 */
StepDate.prototype.getDurationTo = function( targetStepDate) {
    return ( targetStepDate.time.valueOf() - this.time.valueOf());
};

/**
 * Compare this date with a target date
 * @param {StepDate} targetStepDate is the target milestone
 * @returns {Boolean} true if this is greater than the target date
 */
StepDate.prototype.isNewerThan = function( targetStepDate) {
    return targetStepDate == null ? true : (this.time.valueOf() >= targetStepDate.time.valueOf());
};

/**
 * Calculate a duration to reach a target date
 * @param {StepDate} targetStepDate is the target milestone
 * @returns {String} the correspond duration formatted in string to access the target
 */
StepDate.prototype.getStringDurationTo = function( targetStepDate) {
    function __div( num, den) { return new java.lang.Long( (num - (num%den))/den); }
    var HOUR = 3600000; // an hour in ms
    var MINUTE = 60000; // a minute in ms
    var diff = targetStepDate.time - this.time;
    return java.lang.String.format("%dh:%02dm:%02ds", __div( diff,HOUR),
        __div((diff%HOUR),MINUTE), __div((diff%MINUTE),1000));
};

/**
 * Add a number of months to the current date
 * @param {integer} nbMonths
 */
StepDate.prototype.addMonths = function( nbMonths) {
    var cal = java.util.Calendar.getInstance();
    cal.setTimeInMillis( this.time);
    cal.add( java.util.Calendar.MONTH, nbMonths);
    this.time = cal.getTimeInMillis();
};

/**
 * Substract a number of months to the current date
 * @param {integer} nbMonths
 */
StepDate.prototype.subMonths = function( nbMonths) {
    this.addMonths( -nbMonths);
};
    
// END OF FILE

/*===== business library exports - this part will not be imported to STEP =====*/
exports._GLOBAL = _GLOBAL
exports.GLOBAL = GLOBAL
exports._GLOBAL = _GLOBAL
exports.StepDate = StepDate
exports.newInstance = newInstance
exports.newFromIsoDateString = newFromIsoDateString
exports.newFromIsoDateTimeString = newFromIsoDateTimeString
exports.StepDate = StepDate
exports.prototype = prototype
exports.clone = clone
exports.StepDate = StepDate
exports.prototype = prototype
exports.toString = toString
exports.StepDate = StepDate
exports.prototype = prototype
exports.asDateObject = asDateObject
exports.StepDate = StepDate
exports.prototype = prototype
exports.asIsoDate = asIsoDate
exports.StepDate = StepDate
exports.prototype = prototype
exports.asIsoDateTime = asIsoDateTime
exports.StepDate = StepDate
exports.prototype = prototype
exports.addDuration = addDuration
exports.StepDate = StepDate
exports.prototype = prototype
exports.subDuration = subDuration
exports.StepDate = StepDate
exports.prototype = prototype
exports.getDurationTo = getDurationTo
exports.StepDate = StepDate
exports.prototype = prototype
exports.isNewerThan = isNewerThan
exports.StepDate = StepDate
exports.prototype = prototype
exports.getStringDurationTo = getStringDurationTo
exports.StepDate = StepDate
exports.prototype = prototype
exports.addMonths = addMonths
exports.StepDate = StepDate
exports.prototype = prototype
exports.subMonths = subMonths