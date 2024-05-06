/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "ExRelatedProductVariantsLinker",
  "type" : "BusinessAction",
  "setupGroups" : [ "InstructorBusinessRules" ],
  "name" : "Ex Related Product Variants Linker",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SalesItem" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "obj",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (obj,manager,logger) {
var refTypeID = "SimilarProduct";

function createIfNotPresent(source, target, refType) {
	createdNew = true;
	try {
		source.createReference(target, refType);
	}
	catch(e) {
		// expected
		createdNew = false;
	}
	if(createdNew) {
		logger.info("Created reference of type '" +
			refType.getID() + 
			"' from '" + 
			source.getID() + 
			"' to '" + 
			target.getID() + 
			"'."
		);
	}
}

if(obj.getParent().getObjectType().getID() == "SalesItemFamily") {
	var refType = manager.getReferenceTypeHome().getReferenceTypeByID(refTypeID);
	var variants = obj.getParent().getChildren().toArray();
	logger.info("'Related Product Variants Linker' Business Action detected " + variants.length + " variants below '" + obj.getParent().getID() + "'. \nCreating missing '" + refTypeID + "' references.");
	for(var i = 0; i < variants.length; i++) {
		for(var j = 0; j < variants.length; j++) {
			if(j != i) {
				createIfNotPresent(variants[i], variants[j], refType);
			}
		}
	}
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ValidHierarchiesBusinessCondition",
  "parameters" : [ {
    "id" : "HierarchyRoots",
    "type" : "java.util.List",
    "values" : [ ]
  } ],
  "pluginType" : "Precondition"
}
*/
