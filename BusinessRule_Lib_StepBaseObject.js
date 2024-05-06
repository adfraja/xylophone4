/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "Lib_StepBaseObject",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "StepBaseObject",
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
* class StepBaseObject: adapter class to STEP BaseObject
* BaseObject is mainly the base class for STEP objects which holds attribute values
* @this {StepObject}
* @param {com.stibo.core.domain.BaseObject} object is the initial object to setup
* @see interface com.stibo.core.domain.BaseObject
* --------------------------------------------------------
* DEPENDENCIES
* --------------------------------------------------------
*/

var DISPLAY_INFO = true; // should be FALSE in PROD

LEVEL_LABELS = ["INFO", "WARNING", "SEVERE"];
var GLOBAL = new _GLOBAL();
function _GLOBAL() {
    this.traceName = "";
    this.startTime = java.lang.System.currentTimeMillis();
    this.traceTime = this.startTime;
}

/**
 * Constructor for StepBaseObject
 * @param node
 * @param logger
 * @param {String} name is the name of the current business rule (null by default)
 * @constructor
 */
function StepBaseObject(node, logger, name) {
    this.object = node;
    this.log = logger;
    this.contextID = null;
    if (name != null) {
        GLOBAL.traceName = name;
    }
}

/**
 * Return the prototype
 * @private
 * @returns {StepBaseObject} the prototype of the StepObject class
 */
function _class() {
    return new StepBaseObject( null);
}

/**
 * Returns the constructor
 * @private
 * @returns {function} the constructor of the StepBaseObject class
 */
function _super() {
    return StepBaseObject.prototype.constructor;
}

/**
 * Create a new StepBaseObject
 * @param node
 * @param logger
 * @param {String} name is the name of the current business rule (null by default)
 * @returns {StepBaseObject}
 */
function newInstance(node, logger, name) {
    return node == null ? null : new StepBaseObject(node, logger, name);
}

/**
 * Returns a mask containing a class and extensions
 * @param {Array[Class]} extensions to add to the mask
 * @return {StepBaseObject with current extensions} the clone
 */
StepBaseObject.prototype.createNewMask = function (extensions) {
    var clone = new this.constructor;
    if (extensions != null) {
        extensions.forEach(function (extension) {
            extension.Extend(clone);
        });
    }
    return clone;
};

/**
 * Returns a new instance of type StepBaseObject
 * @param {com.stibo.core.domain.Node} node
 * @return {StepBaseObject}
 */
StepBaseObject.prototype.newBasicInstance = function (node) {
    return node == null ? null : new StepBaseObject(node, this.log);
};


/**
 * Return the internal STEP Value Object
 * @private
 * @param {String} attributeID of the attribute that applies on the object
 * @returns {com.stibo.core.domain.Value} the value held by the object
 */
StepBaseObject.prototype._getStepValue = function (attributeID) {
    var value = this.object.getValue(attributeID);
    if (value == null) {
        throw attributeID + " = unknown attribute for " + this;
    }
    return value;
};

/**
 * Obtain the value (including the unit if any) from an attribute that is presumed to be simple value
 * @param {String} attributeID of the attribute that applies on the object
 * @returns {String} the value contained by the attribute or "" if empty
 */
StepBaseObject.prototype.getSimpleValue = function (attributeID) {
    var value = this._getStepValue(attributeID).getSimpleValue();
    return (value == null ? "" : Decode(value));
};

/**
 * Set a value for an attribute that is presumed of type simple value
 * @param {String} attributeID
 * @param {String} content
 * @param {Boolean} withoutEncode (false by default)
 * @throws {String} in case of not permitted content for the attribute
 */
StepBaseObject.prototype.setSimpleValue = function (attributeID, content, withoutEncode) {
    var stepValue = this._getStepValue(attributeID);
    if ( content == null || content === "" ) {
        stepValue.deleteCurrent();
        return;
    }
    stepValue.setSimpleValue(withoutEncode != null && withoutEncode ? content : Encode(content));
};

/**
 * Get the unit that is applicable to the value of an attribute
 * @param {String} attributeID of the attribute that applies on the object
 * @returns {String} the unit terms or "" if not applicable
 */
StepBaseObject.prototype.getValueUnit = function (attributeID) {
    return String(this._getStepValue(attributeID).getUnit().getName());
};

/**
 * Obtain the value ID from an attribute that is presumed to be a simple LOV based value
 * @param {String} attributeID of the attribute that applies on the object
 * @returns {String} the LOV ID contained by the attribute or ""
 * @throws {String} in case of bad attribute ID
 */
StepBaseObject.prototype.getSimpleLovID = function (attributeID) {
    var lovValue = this._getStepValue(attributeID).getLOVValue();
    return (lovValue !== null ? Decode(lovValue.getID()) : "");
};

/**
 * Set the value ID for an attribute that is presumed to be a simple LOV based value
 * @param {String} attributeID
 * @param {String} lovID
 * @param {Boolean} withoutEncode (false by default)
 * @throws {String} in case of not permitted content for the attribute
 */
StepBaseObject.prototype.setSimpleLovID = function (attributeID, lovID, withoutEncode) {
    var stepValue = this._getStepValue(attributeID);
    if ( lovID == null || lovID === "" ) {
        stepValue.deleteCurrent();
        return;
    }
    stepValue.setLOVValueByID(withoutEncode != null && withoutEncode ? lovID : Encode(lovID));
};

/**
 * Set the value ID for an LOV based attribute, ONLY if there is no value
 * @param {type} attributeID
 * @param {type} lovID
 * @param {Boolean} withoutEncode (false by default)
 */
StepBaseObject.prototype.initSimpleLovID = function( attributeID, lovID, withoutEncode) {
    var stepValue = this._getStepValue( attributeID);
    var lovValue = stepValue.getLOVValue();
    if ( lovValue === "" || lovValue == null) {
        stepValue.setLOVValueByID(withoutEncode != null && withoutEncode ? lovID : Encode(lovID));
    }
};

/**
 * Obtain the values from an attribute that is presumed to be multiple values
 * @param {String} attributeID of the attribute that applies on the object
 * @returns {Array} the values contained by the attribute
 */
StepBaseObject.prototype.getMultiValues = function (attributeID) {
    var iterator = this._getStepValue(attributeID).getValues().iterator();
    var contents = [];
    while (iterator.hasNext()) {
        contents.push(Decode(iterator.next().getValue()));
    }
    return contents;
};

/**
 * Obtain the unit IDs from the values of an attribute - which is presumed to be multiple values
 * @param {String} attributeID of the attribute that applies on the object
 * @returns {Array[com.stibo.core.domain.Unit]} the units contained by the attribute, including null objects where there is no unit
 */
StepBaseObject.prototype.getMultiValueUnits = function (attributeID) {
    var iterator = this._getStepValue(attributeID).getValues().iterator();
    var contents = [];
    while (iterator.hasNext()) {
        contents.push( iterator.next().getUnit());
    }
    return contents;
};

/**
 * Clear off the values from an attribute that is presumed to be multiple values
 * @param {String} attributeID of the attribute that applies on the object
 * @throws {String} in case of error on the attribute
 */
StepBaseObject.prototype.clearMultiValues = function (attributeID) {
    this._getStepValue(attributeID).setValues( new java.util.ArrayList());
};

/**
 * Replace the full contents of an attribute that is presumed to be multiple values
 * @param {String} attributeID of the attribute that applies on the object
 * @param {Array[String]} contents to be inserted into the multivalue attribute
 * @throws {String} in case of not permitted content for the attribute
 */
StepBaseObject.prototype.setMultiValues = function (attributeID, contents) {
    var value = this._getStepValue(attributeID);
    value.deleteCurrent(); // empty first
    for (var i = 0; i < contents.length; i++) {
        value.addValue(Encode(contents[i]));
    }
};

/**
 * Add a value to an attribute that is presumed to be multiple values
 * @param {String} attributeID of the attribute that applies on the object
 * @param {String} content to be added to the multivalue attribute
 * @throws {String} in case of not permitted content for the attribute
 */
StepBaseObject.prototype.addToMultiValues = function (attributeID, content) {
    this._getStepValue(attributeID).addValue(Encode(content));
};

/**
 * Remove a value from an attribute that is presumed to be multiple values
 * @param {String} attributeID of the attribute that applies on the object
 * @param {String} content to be removed from the multivalue attribute
 */
StepBaseObject.prototype.removeFromMultiValues = function (attributeID, content) {
    var contents = this.getMultiValues(attributeID);
    var index = contents.indexOf((Encode(content)));
    if (index >= 0) {
        contents.splice(index, 1);
    }
    this.setMultiValues(attributeID, contents);
};

/**
 * Obtain the LOV IDs from an attribute that is presumed to be multiple based LOV values
 * @param {String} attributeID of the attribute that applies on the object
 * @returns {Array} the LOV IDs contained by the attribute
 * @throws {String} in case of bad attribute ID
 */
StepBaseObject.prototype.getMultiLovIDs = function (attributeID) {
    var iterator = this._getStepValue(attributeID).getValues().iterator();
    var contents = [];
    while (iterator.hasNext()) {
        contents.push(Decode(iterator.next().getID()));
    }
    return contents;
};

/**
 * Remove a LOV ID from an attribute that is presumed to be multiple based LOV values
 * @param {String} attributeID of the attribute that applies on the object
 * @param {String} lovID to be removed from the multivalue attribute
 */
StepBaseObject.prototype.removeFromMultiLovIDs = function (attributeID, lovID) {
    var contents = this.getMultiLovIDs(attributeID);
    var index = contents.indexOf(Encode(lovID));
    if (index >= 0) {
        contents.splice(index, 1);
    }
    this.setMultiLovIDs(attributeID, contents);
};

/**
 * Add a LOV ID to an attribute that is presumed to be multiple based LOV values
 * @param {String} attributeID of the attribute that applies on the object
 * @param {String} lovID to be added to the multivalue attribute
 * @throws {String} in case of not permitted content for the attribute
 */
StepBaseObject.prototype.addToMultiLovIDs = function (attributeID, lovID) {
    this._getStepValue(attributeID).addLOVValueByID(Encode(lovID));
};

/**
 * Replace the full ID contents of an attribute that is presumed to be multiple based LOV values
 * @param {String} attributeID of the attribute that applies on the object
 * @param {Array} contents contains the LOV IDs to be inserted into the multivalue attribute
 * @throws {String} in case of not permitted content for the attribute
 */
StepBaseObject.prototype.setMultiLovIDs = function (attributeID, contents) {
    var value = this._getStepValue(attributeID);
    value.deleteCurrent(); // empty
    contents.forEach(function (content) {
        value.addLOVValueByID(Encode(content));
    });
};

StepBaseObject.prototype.isContextInherited = function(attributeID) {
    var stepValue = this._getStepValue( attributeID);
    return ( stepValue.isDimensionPointInherited() );
};

/**
 * @returns {String} the ID of the encapsulated node
 */
StepBaseObject.prototype.getID = function () {
    return String(this.object.getID());
};

/**
 * @returns {String} the name of the encapsulated node
 */
StepBaseObject.prototype.getName = function () {
    return Decode(this.object.getName());
};

/**
 * @returns {String} the ID of the type of the encapsulated node
 */
StepBaseObject.prototype.getUserTypeID = function () {
    return String(this.object.getObjectType().getID());
};

/**
 * Set the name of the encapsulated node
 * @param {String} newName
 */
StepBaseObject.prototype.setName = function (newName) {
    this.object.setName(Encode(newName.trim()));
};

/**
 * Returns a readable representation of this
 * @returns {String} a text representation of the object
 */
StepBaseObject.prototype.toString = function () {
    if (this.object instanceof com.stibo.core.domain.Node) {
        return ("'" + this.getName() + "' (" + this.object.getID() + ")");
    }
    return String(this.object);
};

/**
 * Delete and approve the node unless stated otherwise
 * @param {Boolean} withoutApproval must be true to prevent the approval of the delete (false by default)
 */
StepBaseObject.prototype.delete = function (withoutApproval) {
    var deletedObject = this.object.delete();
    if ( deletedObject != null && (withoutApproval == null || !withoutApproval)) {
        deletedObject.approve();
    }
};

/**
 * Returns the current manager of this object
 * @returns {com.stibo.core.domain.Manager} the current Manager of the object
 */
StepBaseObject.prototype.getManager = function () {
    return this.object.getManager();
};

/**
 * Returns the context ID in which the object is currently defined
 * @returns {String} the context ID in which the object is currently defined
 */
StepBaseObject.prototype.getContextID = function () {
    if (this.contextID == null) {
        this.contextID = String(this.object.getManager().getCurrentContext().getID());
    }
    return this.contextID;
};

/**
 * Clone this with all its current attributes and methods but allow a different STEP node
 * @param {com.stibo.core.domaine.BaseObject} node is the new internal pointer of the cloned object
 * @returns {StepBaseObject with current extensions} the clone
 */
StepBaseObject.prototype.clone = function (node) {
    if ( node == null ) return null; // by convention
    var clone = new this.constructor;
    for (var prop in this) {
        if (this.hasOwnProperty(prop)) {
            clone[prop] = this[prop];
        }
    }
    clone.log = this.log;
    clone.object = node;
    clone.contextID = null;
    return clone;
};

/**
 * Clone this in another manager
 * @param {com.stibo.core.domain.Manager} manager is the manager that must be applied for instanciation
 * @returns {StepBaseObject with current extensions} the clone
 */
StepBaseObject.prototype.cloneByManager = function( manager) {
    return this.clone( manager.getObjectFromOtherManager(this.object));
};

/**
 * Displays an ERROR message
 * @param {String} message is the message to display
 * @param {String} methodName is the method which calls the debug instruction
 */
StepBaseObject.prototype.errorMessage = function(message, methodName) {
    _debugMessage( this.log , message, methodName, 2);
};

/**
 * Displays an INFO message
 * @param {String} message is the message to display
 * @param {String} methodName is the method which calls the debug instruction
 */
StepBaseObject.prototype.infoMessage = function( message, methodName) {
    _debugMessage( this.log , message, methodName, 0);
};

/**
 * Displays a WARNING message
 * @param {String} message is the message to display
 * @param {String} methodName is the method which calls the debug instruction
 */
StepBaseObject.prototype.warningMessage = function( message, methodName) {
    _debugMessage( this.log , message, methodName, 1);
};

/**
 * Displays a message with a given level, if the level is INFO and the Debug mode is enabled then it is displayed
 * @param {Logger} log is the logger
 * @param {String} message is the message to display
 * @param {String} methodName is the method which calls the debug instruction
 * @param {Number} level of the message: 0=info, 1=warning, other=severe
 */
function _debugMessage( log, message, methodName, level) {
    if (log != null) {
        if ((level === 2|| level === 1 || (DISPLAY_INFO && level === 0))) {
            var separator = '|';
            var currentTime = java.lang.System.currentTimeMillis();
            var infoMessage = LEVEL_LABELS[level] + (GLOBAL.traceName !== "" ? separator + GLOBAL.traceName + " (" + (currentTime - GLOBAL.traceTime) + " ms)" : "") + " :" + (methodName != null ? methodName + separator : "") + message ;
            log.info(infoMessage);
        }
    }
}

/**
 * Trace an exception that ends the current business rule
 * @param {exception} error
 * @returns {exception} the error is returned so to be able to be thrown back
 */
StepBaseObject.prototype.traceException = function (error) {
    this.errorMessage(GLOBAL.traceName + " EXCEPTION: " + error + "\n");
    this.traceEnd();
    return error;
};

/**
 * Trace a message for business rule end
 */
StepBaseObject.prototype.traceEnd = function () {
    if (DISPLAY_INFO) {
        var totalTime = "Duration = " + (java.lang.System.currentTimeMillis() - GLOBAL.startTime) + " ms";
        this.log.info(GLOBAL.traceName + " END OF BUSINESS RULE " + totalTime);
    }
};

/**
 * Encode a string by replacing < and >
 * @return {String} encoded content
 */
StepBaseObject.prototype.encode = function (content) {
    return Encode(content);
};

/**
 * Encode a string to STEP convention by replacing &lt; and &gt;
 * Should be only privately used
 * @see Decode
 * @param {String} content is the input string
 * @returns {String} the encoded string
 */
function Encode(content) {
    if (content == null || content === "")
        return "";
    var encoded1 = String(content).replace(/</g, "<lt/");
    var encoded2 = encoded1.replace(/>/g, "<gt/>");
    return encoded2.replace(/<lt\//g, "<lt/>");
}

/**
 * Decode a string from STEP convention by replacing &lt; and &gt;
 * Should be only privately used
 * @see Encode
 * @param {String} content is the string coming from STEP
 * @returns {String} the decoded string
 */
function Decode(content) {
    if (content == null || content === "")
        return "";
    var decoded = String(content).replace(/<lt\/>/g, "<");
    return decoded.replace(/<gt\/>/g, ">");
}

// END OF FILE
/*===== business library exports - this part will not be imported to STEP =====*/
exports.DISPLAY_INFO = DISPLAY_INFO
exports.LEVEL_LABELS = LEVEL_LABELS
exports.GLOBAL = GLOBAL
exports._GLOBAL = _GLOBAL
exports._GLOBAL = _GLOBAL
exports.StepBaseObject = StepBaseObject
exports._class = _class
exports._super = _super
exports.newInstance = newInstance
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.createNewMask = createNewMask
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.newBasicInstance = newBasicInstance
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports._getStepValue = _getStepValue
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getSimpleValue = getSimpleValue
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.setSimpleValue = setSimpleValue
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getValueUnit = getValueUnit
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getSimpleLovID = getSimpleLovID
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.setSimpleLovID = setSimpleLovID
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.initSimpleLovID = initSimpleLovID
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getMultiValues = getMultiValues
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getMultiValueUnits = getMultiValueUnits
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.clearMultiValues = clearMultiValues
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.setMultiValues = setMultiValues
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.addToMultiValues = addToMultiValues
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.removeFromMultiValues = removeFromMultiValues
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getMultiLovIDs = getMultiLovIDs
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.removeFromMultiLovIDs = removeFromMultiLovIDs
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.addToMultiLovIDs = addToMultiLovIDs
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.setMultiLovIDs = setMultiLovIDs
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.isContextInherited = isContextInherited
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getID = getID
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getName = getName
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getUserTypeID = getUserTypeID
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.setName = setName
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.toString = toString
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.delete = delete
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getManager = getManager
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.getContextID = getContextID
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.clone = clone
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.cloneByManager = cloneByManager
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.errorMessage = errorMessage
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.infoMessage = infoMessage
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.warningMessage = warningMessage
exports._debugMessage = _debugMessage
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.traceException = traceException
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.traceEnd = traceEnd
exports.StepBaseObject = StepBaseObject
exports.prototype = prototype
exports.encode = encode
exports.Encode = Encode
exports.Decode = Decode