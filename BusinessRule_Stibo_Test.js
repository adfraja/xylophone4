/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "Stibo_Test",
  "type" : "BusinessCondition",
  "setupGroups" : [ "PMDM.BusinessRuleConditions" ],
  "name" : "Stibo_Test",
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
    "contract" : "CurrentObjectBindContract",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
logger.warning("Asset approval test on condition start : condition");
var debug = true;
var errors = new java.util.ArrayList();
var AcceptReworkInconsistent = manager.getEntityHome().getEntityByID("SysMsg_con-cc39_AcceptReworkInconsistent").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'You must populate the "Message to Supplier" field in the previous screen when either the "Rework" or "Reject" options are selected.'
var AcceptReworkInconsistent2 = manager.getEntityHome().getEntityByID("SysMsg_con-cc3_AcceptReworkInconsistent2").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'You must select either the "Rework" or "Reject" options in the previous screen whenever the "Message to Supplier" field has been populated.'
var AcceptReworkInconsistent3 = manager.getEntityHome().getEntityByID("SysMsg_con-cc3_AcceptReworkInconsistent3").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'You need to set a Proposal Status.'
var AcceptReworkInconsistent4 = manager.getEntityHome().getEntityByID("SysMsg_con-cc3_AcceptReworkInconsistent4").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'Products onboarded via GDSN cannot be returned for"Rework".'
var AcceptReworkInconsistent5 = manager.getEntityHome().getEntityByID("SysMsg_con-cc3_AcceptReworkInconsistent5").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'Product cannot be approved because of missing mandatory data:&lt;br&gt;%s'

function log(message) {
	if(debug) {
		logger.info("Proposal Approval Buyer: " + message);
	}
}
//getSingleValueLovID(product, attributeID)
var processedBy = getSingleValueLovID(node, "PMDM.AT.ProcessedBy");
logger.warning(processedBy);

function getSingleValueLovID(product, attributeID) {
	logger.warning("product = " + product.getID());
	logger.warning("attributeID = " + attributeID);
	var value = product.getValue(attributeID);
	logger.warning("attributeValue = " + value);
	logger.warning("attributeValueID = " + value.getID());
	if (value) {
		return value.getID();
	}
	return null;
}



return true;

}