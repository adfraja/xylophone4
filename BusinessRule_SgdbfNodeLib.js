/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "SgdbfNodeLib",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "SgdbfNodeLib",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ {
    "libraryId" : "Util_StepDate",
    "libraryAlias" : "StepDate"
  } ]
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
 * SgdbfNodeLib
 * --------------------------------------------------------
 * DEPENDENCIES:
 *       StepDate
 * --------------------------------------------------------
 */
/* global StepDate, SgdbfNodeLib */
function CONST() {}

/**
 *
 * @param node {com.stibo.core.domain.Node}
 * @param attributeID {string}
 * @return {string}
 */
function getSimpleValue(node, attributeID) {
    var value = node.getValue(attributeID).getSimpleValue();
    return value == null ? "" : String(value);
}

/**
 * Get the string value of the lov ID
 * @param {com.stibo.core.domain.Node} node
 * @param {string} attributeID
 * @return {string}
 */
function getSimpleLovID(node, attributeID) {
    var lovValue = node.getValue(attributeID).getLOVValue();
    return lovValue != null ? String(lovValue.getID()) : "";
}

/**
 * Set the value ID for an attribute that is presumed to be a simple LOV based value
 * @param {com.stibo.core.domain.Node} node
 * @param {String} attributeID
 * @param {String} lovID
 * @throws {String} in case of not permitted content for the attribute
 */
function setSimpleLovID(node, attributeID, lovID) {
    var stepValue = node.getValue(attributeID);
    if ( lovID == null || lovID === "" ) {
        stepValue.deleteCurrent();
        return;
    }
    stepValue.setLOVValueByID(lovID);
}

/**
 * Set a value for an attribute that is presumed of type simple value
 * @param {com.stibo.core.domain.Node} node
 * @param {String} attributeID
 * @param {String} content
 * @throws {String} in case of not permitted content for the attribute
 */
function setSimpleValue(node, attributeID, content) {
    var stepValue = node.getValue(attributeID);
    if ( content == null || content === "" ) {
        stepValue.deleteCurrent();
        return;
    }
    stepValue.setSimpleValue(content);
}

/**
 * Notify a change on this by refreshing the presence of offre and triggering an event
 * BEWARE:the call of this function with true provokes infinite loop when called in an
 * approval action/condition of this
 * @param node {StepNode}
 * @param {Boolean} approveValue = true when one want to approve the value (default false).
 */
function notifyRepublishing(node, approveValue) {
    node.infoMessage("RG112 notfying for republishing " + node +
        " (approve=" + (approveValue == null ? false : approveValue) + ")", "notifyRepublishing");
    var now = StepDate.newInstance();
    var thisNode = node;
    node.getManager().executeWritePrivileged(function () {
        thisNode.setSimpleValue("ATD_TIMESTAMP", now.asIsoDateTime());
    });
    if (approveValue != null && approveValue) {
        node.approve();
    }
}

/**
 * @param support {com.stibo.core.domain.Classification | StepNode}
 * @param attributeID {string}
 * @returns {Boolean}
 */
function isValidDescriptionAttribute(support, attributeID) {
    support = (support.object != null ? support.object : support);
    var attributeHome = support.getManager().getAttributeHome();
    var attribute = attributeHome.getAttributeByID(attributeID);
    return (support.getObjectType().isValidDescriptionAttribute( attribute));
}

/**
 * Check whether this is the node at the root of an Enseigne
 * @param parent {com.stibo.core.domain.Classification | StepNode}
 * @returns {Boolean} True if this is at the root of an Enseigne
 */
function isRootEnseigne(parent) {
    var parentType = parent.object != null ? parent.getUserTypeID() : String(parent.getObjectType().getID());
    return ( parentType === "CLAS_ENS" || parentType === "CLAS_ENJ" );
}

/**
 * Get the context ID of the Enseigne Marketing/Juridique that relates this
 * @param {com.stibo.core.domain.Classification | StepNode} support
 * @returns {String} the context ID attached to the enseigne that holds this
 * @throws {String} an error message whenever no Enseigne Marketing/Juridique had been found
 */
function getEnseigneID(support) {
    var validity = isValidDescriptionAttribute(support, "ATD_CONTEXTE");
    var enseigneID = ( validity ? (support.object != null ? support.getSimpleLovID( "ATD_CONTEXTE") : getSimpleLovID(support, "ATD_CONTEXTE")) : null ); // else check the attribute
    if ( enseigneID != null && enseigneID !== "" ) {
        return enseigneID;
    }
    var parent = support; // only for new Node, compute it and store it in the attribute
    while ( parent != null )  {
        if ( isRootEnseigne(parent) ) {
            enseigneID = (parent.object != null) ? parent.getSimpleLovID("ATD_CONTEXTE_ENSEIGNE") : getSimpleLovID(parent, "ATD_CONTEXTE_ENSEIGNE");
            if ( validity ) {
                if (support.object != null) {
                    support.setSimpleLovID( "ATD_CONTEXTE", enseigneID);
                } else {
                    setSimpleLovID(support, "ATD_CONTEXTE", enseigneID);
                }
            }
            return enseigneID;
        }
        parent = parent.getParent();
    }
    throw "getEnseigneID: Racine d'enseigne marketing/juridique non trouvée pour " + support.getID();
}

/**
 * Convert an enseigne ID into the corresponding Offre ID
 * @export ConvertEnseigneIDIntoOffreID
 * @param {StepBaseObject} offre (/!\ Must be extended by <b>SgdbfContext</b>)
 * @param {String} enseigneID
 * @returns {String} offreID
 */
function ConvertEnseigneIDIntoOffreID(offre, enseigneID) {
    if (offre.contextHasParent(enseigneID)) {
        return offre.getParentForContext(enseigneID);
    }
    return enseigneID; // In other cases enseigneID == offreID
}

/**
 *
 * Determine if this offer node can contain produits
 * @param offre {StepClassification}
 * @returns {Boolean} true if this can host produits
 */
function isLinkableToProduits(offre) {
    var enabledTypes = ["CLAS_UB",
        "CLAS_CP", "CLAS_CP_COPIE", "CLAS_EBL", "CLAS_COPIE_UB_CLIENT"];
    return ( enabledTypes.indexOf( offre.getUserTypeID()) >= 0 );
}

/**
 * Get the references sorted according to an attribute value that is held onto the reference
 * As for instance, this is often useful to obtain the result of a "display order" attached to the reference.
 * @param support {StepNode}
 * @param {String} refTypeID defines the reference type ID
 * @param {String} attrID defines the attribute that is valid onto the reference
 * @param {boolean} setNotNumberLast determine if not-number values mean last position or first position if false
 * @returns {Array[com.stibo.core.domain.Reference]} a sorted list of references
 */
function getSortedReferencesByAttributeValue(support, refTypeID, attrID, setNotNumberLast) {
    // internal function to sort references according to their attribute value
    function sortByAttributeValue( ref1, ref2) {
        var value1 = parseInt( getSimpleValue( ref1, attrID));
        var value2 = parseInt( getSimpleValue( ref2, attrID));
        if ( !isNaN(value1) && !isNaN(value2) ) {
            return ( value1 - value2 );
        }
        else if ( isNaN(value1) && !isNaN(value2) ) {
            return setNotNumberLast ? 1 : -1;
        }
        else if ( !isNaN(value1) && isNaN(value2) ) {
            return setNotNumberLast ? -1 : 1;
        }
        return 0;
    }
    return support.getReferences(refTypeID).sort(sortByAttributeValue);
}

/**
 * Checks if all the mandatory attributes are filled
 * @param node {com.stibo.core.domain.Node}
 * @param mandatoryAttributeIds { String[]}
 * @param errors {String[]}
 * @returns {string}
 */
function checkMandatoryAttributes(node, mandatoryAttributeIds, errors) {
    var attributeHome = node.getManager().getAttributeHome();
    mandatoryAttributeIds
        .map(function (attributeId) {
            return attributeHome.getAttributeByID(attributeId);
        })
        .filter(function (attribute) {
            return node.getValue(attribute.getID()).getSimpleValue() === null;
        })
        .forEach(function (attribute) {
            errors.push("Attribut obligatoire non renseigné : " + attribute.getName());
        });
}

/**
 * @memberOf SgdbfNodeLib
 * Gets the first character for classification
 * @param name
 * @returns {string}
 */
function getFirstCharFolderPrefix(name) {
    var map = {
        'a' : 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
        'e' : 'é|è|ê|ë|É|È|Ê|Ë',
        'i' : 'í|ì|î|ï|Í|Ì|Î|Ï',
        'o' : 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
        'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        'c' : 'ç|Ç',
        'n' : 'ñ|Ñ'
    };
    var firstChar = name.charAt(0);
    for (var pattern in map) {
        firstChar = firstChar.replace(new RegExp(map[pattern], 'g'), pattern);
    }
    var newPrefix;
    if (firstChar.match(/[a-zA-Z]/g) == null) {
        // doesn't start with a letter
        newPrefix = "0_9";
    } else {
        // starts with a letter
        newPrefix = firstChar.toUpperCase();
    }
    return newPrefix;
}

// END OF FILE
/*===== business library exports - this part will not be imported to STEP =====*/
exports.CONST = CONST
exports.getSimpleValue = getSimpleValue
exports.getSimpleLovID = getSimpleLovID
exports.setSimpleLovID = setSimpleLovID
exports.setSimpleValue = setSimpleValue
exports.notifyRepublishing = notifyRepublishing
exports.isValidDescriptionAttribute = isValidDescriptionAttribute
exports.isRootEnseigne = isRootEnseigne
exports.getEnseigneID = getEnseigneID
exports.ConvertEnseigneIDIntoOffreID = ConvertEnseigneIDIntoOffreID
exports.isLinkableToProduits = isLinkableToProduits
exports.getSortedReferencesByAttributeValue = getSortedReferencesByAttributeValue
exports.checkMandatoryAttributes = checkMandatoryAttributes
exports.getFirstCharFolderPrefix = getFirstCharFolderPrefix