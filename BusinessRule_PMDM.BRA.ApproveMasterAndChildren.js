/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.ApproveMasterAndChildren",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "Approve Internal Master and Children",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "PMDM.PRD.InternalMasterProduct" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,manager) {
var debug=true;
var msg1 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BRA.ApproveInterna_msg1").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'Parent node has never been approved so "%s" cannot be approved.'
var msg2 = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BRA.ApproveInterna_msg2").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // '"{object}" cannot be fully approved because of the following:{exceptions}'

function log(message){
	if(debug){
		logger.info("Approve Node and children: " + message);
	}
}

function approveNode(nodeToApprove) {
	log("Before approval of " + nodeToApprove.getID() + ": " + nodeToApprove.getNonApprovedObjects());

	// Check is parent product is approved
	var parent = node.getParent();
	if (parent.getApprovalStatus().name().equals("NotInApproved")) {
		var message = (msg1 + "").replace("%s", node.getName()); // 'Parent node has never been approved so %s cannot be approved.'
		throw(message);
	}
	
	var exceptions = nodeToApprove.approve();
	log("Number of exceptions = " + exceptions.size());
	
	if (exceptions.size() > 0) {
		var exceptionString = "";
		for(var i=0; i<exceptions.size(); i++) {
			logger.info(exceptions.get(i));
			//exceptionString = exceptionString + "\n" + exceptions.get(i).getMessage();
			exceptionString = exceptionString + "<br><br>" + exceptions.get(i).getMessage();
		}
		var message = (msg2 + "").replace("{object}", nodeToApprove.getName()).replace("{exceptions}", exceptionString); // '"{object}" cannot be fully approved because of the following:{exceptions}'
		throw(message);
	}
	log("After approval: " + nodeToApprove.getNonApprovedObjects());
}


// Starts here
log("Approving node: " + node.getID() + " and children");

// Approve current object
approveNode(node);

// Approve children
var children = node.getChildren();
var itr = children.iterator();
while (itr.hasNext())

{ var child = itr.next(); child.approve(); };

log("Finished approving node: " + node.getID() +  " and children");
}