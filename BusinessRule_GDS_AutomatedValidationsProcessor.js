/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "GDS_AutomatedValidationsProcessor",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Automated Validations Processor",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
    "contract" : "ProductBindContract",
    "alias" : "node",
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
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "tableHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,logger,tableHome) {
/*
	GDSN CIC API documentation:
		API consists primarily with interfaces found at http://[system name]/sdk/doc/com/stibo/gdsn2/receiver/domain/model/packaging/package-frame.html
		A product implementing these interfaces will also implement Product and will be a a package hierarchy object.
		You may bind to the GDSN Receiver Packaging Product instead of 'Current Object'.  The bound node will implement PackagingMember (even if it is also a PackagingTop).

	Code bindings:
		node =	GDSN Receiver Packaging Product
		manager =	STEP Manager
		logger =	Logger
		
	Dependencies:
		Customer Validation Library ('customLib')
	Changes:
		25-09-2020 KLMA Fix problem with moveRVGs being called multiple time for each lower level product.
*/

/*********** START temporary fix until RVGs can be rooted outside of package hierarchy root  ************/

var table = "RVGParentLinkLookUps_GDS";
var hierarchyObjects = acceleratorLib.getPackageHierarchyObjectTypes();

var seenNodes = [];
function alreadySeen(node) {
    var id = node.getID();
    for (ite = 0; ite < seenNodes.length; ite++) {
	if (id == seenNodes[ite]) {
	    return true;
	}
    }
    seenNodes.push(id);
    return false;
}

function moveRVGs(node){
    if (alreadySeen(node)) {
	// Avoid infinite loops
	return;
    }
	//logger.info("CIN Inbound - checking for root move of " + node.getID());
	var refs = node.getProductReferences().asSet().iterator();
	while (refs.hasNext()){
		var target = refs.next().getTarget();
	    moveRVGs(target);
	}

	var id = node.getObjectType().getID();
	if (!hierarchyObjects.contains(id)){
		var root = tableHome.getLookupTableValue(table, id);

		if (!id.equals(root)){
			var parent = manager.getProductHome().getProductByID(root);
			if (parent){
			    node.setParent(parent);
			    //logger.info("RVG " + node.getID() + " successfully moved to: " + parent.getName());
			}
		}
	}
	
}
/********** END temporary fix until RVGs can be rooted outside of package hierarchy root  ***********/

	
var topNode = node.asTop();		
if (topNode){
	logger.info("*********************	Validating " + topNode.getID() + "	******************************");
	
	// clear any previous CIC review messages
	topNode.setCICReviewDone();

	// move the RVGs (temporary fix)
	moveRVGs(topNode);

	// undo any previous withdrawals on this hierarchy
	withdrawalLib.undoWithdrawal(node, manager, logger);
	
	// set package hierarchy reference values
	acceleratorLib.setHierarchyValues(topNode, manager, logger);

	// execute customer's validation function.
	customLib.automatedValidations(topNode, manager, logger);
}
}