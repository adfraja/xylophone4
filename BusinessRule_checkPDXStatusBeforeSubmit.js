/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "checkPDXStatusBeforeSubmit",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "checkPDXStatusBeforeSubmit",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "selfServiceReferenceType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "SupplierAccount",
    "description" : null
  } ],
  "messages" : [ {
    "variable" : "noChannelAccount",
    "message" : "Please submit channel account invitation first",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,log,selfServiceReferenceType,noChannelAccount) {
var pdxWF = manager.getWorkflowHome().getWorkflowByID("PDXInvitationHandling");
if(pdxWF){
var supplierClassOfSupplierEntity = getSupplierClassificationFromSupplierEntity(node);
var parentSupplierClass = supplierClassOfSupplierEntity.getParent();

log.info("Is this the parent?" + parentSupplierClass.getID());

var channelID = manager.getAttributeHome().getAttributeByID("PDXChannelAccountIdentifier");
var invID = manager.getAttributeHome().getAttributeByID("PDXInvitations");

log.info(supplierClassOfSupplierEntity);
log.info("GetValue for Channel ID ");

var channelIDValue = parentSupplierClass.getValue(channelID.getID()).getSimpleValue();
var invIDValue = parentSupplierClass.getValue(invID.getID()).getSimpleValue();
log.info(channelIDValue);

var message = new noChannelAccount;

if(channelIDValue || invIDValue != null){
	log.info("Channel ID is not available.  Returning error.");
	return true;

} else {
	return message;
}
}else{
	return true;
}


function getSupplierClassificationFromSupplierEntity(supplierEntity) {
	var supplierClassification = node.queryReferences(selfServiceReferenceType).asList(1);
	if(supplierClassification.size() >0){
		supplierClassification = supplierClassification.get(0).getTarget();
		return supplierClassification;
	} else{
		return null;
	}
}

}