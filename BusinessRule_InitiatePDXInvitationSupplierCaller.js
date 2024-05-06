/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "InitiatePDXInvitationSupplierCaller",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "InitiatePDXInvitationSupplierCaller",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
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
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "supplierAccountReferenceType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "SupplierAccount",
    "description" : null
  }, {
    "contract" : "DataIssuesContextBind",
    "alias" : "dataIssuesReport",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,supplierAccountReferenceType,dataIssuesReport,web) {
var debug = true;

function log(message) {
	// For debugging purpose. Don't forget to set debug to false when going live.
	if(debug) {
		logger.info("Initiate PDX Invitation Caller: " + message);
	}
}

function findSupplierClassification(supplier) {
	var result = null;
	node.queryReferences(supplierAccountReferenceType).forEach(
		function(reference) {
			result = reference.getTarget().getParent();
			return false;
		}
	);
	return result;
}

var supplierClassification = findSupplierClassification(node);

// The business action should only be executed if not linked to NoSelfServiceEntities - but I guess you are going to disable the button in this case?

if (supplierClassification) {
	var businessAction = manager.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome).getBusinessActionByID("InitiatePDXInvitationSupplier");
	if (businessAction) {
		try {
			var result = businessAction.execute(supplierClassification);
		} catch(e) {
			//throw e.javaException.getLocalizedMessage();
			log(e.javaException.getLocalizedMessage());
			dataIssuesReport.addError(e.javaException.getLocalizedMessage());
			return dataIssuesReport;
		}
	}
	web.showAlert("ACKNOWLEDGMENT", "PDX Invitation", "PDX Invitation was successfully initiated");
}

}