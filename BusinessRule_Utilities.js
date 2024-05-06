/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "Utilities",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Utilities",
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
// ----- Misc -----

// Checks whether a Product is below another Product
function isProductBelow(prod, checkProdID) {
	if(!isProduct(prod)) throw "Function only works with Products";
	if(checkProdID == "Product hierarchy root") return true;
	if(prod.getID() == "Product hierarchy root") throw "The top level Product is never below another Product.";
	var currentParentId;
	var currentProd = prod;
	while (true) {
		currentParentId = currentProd.getParent().getID();
		if(currentParentId == "Product hierarchy root") return false;
		else if (currentParentId == checkProdID) return true;
		else currentProd = currentProd.getParent();
	}
}

// Gets completeness for object
function getNodeCompleteness(manager, obj) {
	if(isProduct(obj) || isEntity(obj)) 
		return manager.getDataQualityHome().getCompletenessInfo(obj).getCompletenessScore();
	else throw "Only Products and Entities have a Completeness";
}

// ----- References ----- 

// Checks if object has Reference of specific Type
function hasReferenceOfType(manager, sourceObj, refTypeID) {
	var refType = getReferenceType(manager, refTypeID);
	var refArr = sourceObj.getReferences(refType).toArray();
	return refArr.length > 0;
}

// Checks if object has a Reference of a specific Type to a specific Target object
function referenceExists(manager, sourceObj, refTypeID, targetID) {
	var refType = getReferenceType(manager, refTypeID);
	var refArr = toJsArray(sourceObj.getReferences(refType));
	return refArr.some(function(ref) {return ref.getTarget().getID() == targetID && ref.getSource().equals(sourceObj);});
}

// Creates Product Reference of specific Type if it does not exist in advance
function createProductReferenceOfType(manager, sourceObj, refTypeID, targetID){
	if(isProduct(sourceObj)	|| isClassification(sourceObj) || isEntity(sourceObj)) {
		var targetObj = getObject(manager, targetID, "Product");
		createReferenceOfType(manager, sourceObj, refTypeID, targetObj);
	}
	else throw "Product References are only valid from Products, Classifications and Entities.";
}

// Creates Asset Reference of specific Type if it does not exist in advance
function createAssetReferenceOfType(manager, sourceObj, refTypeID, targetID){
	if(isProduct(sourceObj)	|| isClassification(sourceObj) || isEntity(sourceObj)) {
		var targetObj = getObject(manager, targetID, "Asset");
		createReferenceOfType(manager, sourceObj, refTypeID, targetObj);
	}
	else throw "Asset References are only valid from Products, Classifications and Entities.";
}

// Creates Entity Reference of specific Type if it does not exist in advance
function createEntityReferenceOfType(manager, sourceObj, refTypeID, targetID){
	if(isProduct(sourceObj)	|| isClassification(sourceObj) || isEntity(sourceObj) || isAsset(sourceObj)) {
		var targetObj = getObject(manager, targetID, "Entity");
		createReferenceOfType(manager, sourceObj, refTypeID, targetObj);
	}
	else throw "Entity References are only valid from Products, Classifications, Assets and Entities.";
}

// ----- Product to Classification Links -----
//Check for inheritance

// Creates Product to Classification Link of specific Type
function createProdClassLinkOfType(manager, sourceProdObj, linkTypeID, targetClassID) {
	if(prodClassLinkExists(manager, sourceProdObj, linkTypeID, targetClassID)) return;
	else sourceProdObj.createClassificationProductLink(getObject(manager, targetClassID, "Classification"), getLinkType(manager, linkTypeID));
}

// Checks if Product has a Link of a specific Type to a specific Classification 
function prodClassLinkExists(manager, sourceProdObj, linkTypeID, targetClassID) {
	var linksArr = getLinksOfTypeArr(manager, sourceProdObj, linkTypeID);
	return linksArr.some(function(e) {return e.getClassification().getID() == targetClassID && e.getProduct().equals(sourceProdObj);});
}

// Checks if Product has Product to Classification Link of specific Type
function hasProdClassLinkOfType(manager, sourceProdObj, linkTypeID) {
	var linksArr = getLinksOfTypeArr(manager, sourceProdObj, linkTypeID);
	return linksArr.length > 0;
}

// ----- Helper Functions -----

// Converts Java Collection into JS array
function toJsArray(javaColl) {
	var result = [];
	var javaArr = javaColl.toArray();
	for(var i = 0; i < javaArr.length; i++) {
		result[i] = javaArr[i];
	}
	return result;
}

// (Helper) Checks if object is a Product
function isProduct(obj) {
	return obj instanceof com.stibo.core.domain.Product;
}

// (Helper) Checks if object is a Classification
function isClassification(obj) {
	return obj instanceof com.stibo.core.domain.Classification;
}

// (Helper) Checks if object is an Entity
function isEntity(obj) {
	return obj instanceof com.stibo.core.domain.entity.Entity;
}

// (Helper) Checks if object is an Asset
function isAsset(obj) {
	return obj instanceof com.stibo.core.domain.Asset;
}

// (Helper) Gets object from ID - works with "type"'s "Product", "Classification", "Asset" and "Entity"
function getObject(manager, objID, type) {
	var obj;
	switch(type) {
	case "Product":
		obj = manager.getProductHome().getProductByID(objID);
		break;
	case "Classification":
		obj = manager.getClassificationHome().getClassificationByID(objID);
		break;
	case "Asset":
		obj = manager.getAssetHome().getAssetByID(objID);
		break;
	case "Entity":
		obj = manager.getEntityHome().getEntityByID(objID);
		break;
	default:
		throw "Invalid type argument. Must be 'Product', 'Classification', 'Asset' or 'Entity'";
	}
	if(obj == null) throw type + " with ID '" + objID + "' does not exist.";
	else return obj;
}

// (Helper) Creates Reference of specific Type if it does not exist in advance
function createReferenceOfType(manager, sourceObj, refTypeID, targetObj) {
	var refArr = toJsArray(sourceObj.getReferences(refType));
	var exists = refArr.some(function(ref) {return ref.getTarget().equals(targetObj) && ref.getSource().equals(sourceObj);});
	if(exists) return;
	else sourceObj.createReference(targetObj, refTypeID);
}

// (Helper) Gets Reference Type object from ID
function getReferenceType(manager, refTypeID) {
	var refType = manager.getReferenceTypeHome().getReferenceTypeByID(refTypeID);
	if(refType == null) throw "Reference Type with ID '" + refTypeID + "' does not exist.";
	else return refType;
}

// (Helper) Gets JS array with Product to Classification Links
function getLinksOfTypeArr(manager, sourceProdObj, linkTypeID) {
	if(!isProduct(sourceProdObj)) throw "Product to Classification Links can only go from Products";
	var linkType = getLinkType(manager, linkTypeID);
	var linksOfType = sourceProdObj.getClassificationProductLinks().get(linkType);
	if(linksOfType == null) throw "Link Type with ID '" + linkTypeID + "' not valid for Product with ID '" + sourceProdObj.getID() + "'.";
	return toJsArray(linksOfType);
}

// (Helper) Gets Product to Classification Link Type from Link Type ID
function getLinkType(manager, linkTypeID) {
	var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID(linkTypeID);
	if(linkType == null) throw "Link Type with ID '" + linkTypeID + "' does not exist.";
	else return linkType;
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.isProductBelow = isProductBelow
exports.getNodeCompleteness = getNodeCompleteness
exports.hasReferenceOfType = hasReferenceOfType
exports.referenceExists = referenceExists
exports.createProductReferenceOfType = createProductReferenceOfType
exports.createAssetReferenceOfType = createAssetReferenceOfType
exports.createEntityReferenceOfType = createEntityReferenceOfType
exports.createProdClassLinkOfType = createProdClassLinkOfType
exports.prodClassLinkExists = prodClassLinkExists
exports.hasProdClassLinkOfType = hasProdClassLinkOfType
exports.toJsArray = toJsArray
exports.isProduct = isProduct
exports.isClassification = isClassification
exports.isEntity = isEntity
exports.isAsset = isAsset
exports.getObject = getObject
exports.createReferenceOfType = createReferenceOfType
exports.getReferenceType = getReferenceType
exports.getLinksOfTypeArr = getLinksOfTypeArr
exports.getLinkType = getLinkType