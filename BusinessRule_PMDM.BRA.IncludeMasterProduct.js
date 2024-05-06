/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.IncludeMasterProduct",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "Include Master Product",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "contract" : "CurrentEventBatchBinding",
    "alias" : "batch",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,batch) {
var events = batch.getEvents();
for (var i = 0; i < events.size(); i++) {
	var event = events.get(i);
	var node = event.getNode();
	if (node != null){
		var masterProductsToInclude = GRExportLibrary.collectMasterProductsToInclude(logger, node);
		// Go through nodes and add to queue
		iter = masterProductsToInclude.values().iterator();
		while (iter.hasNext()) {
			var newNode = iter.next();	
			batch.addAdditionalNode(newNode);
		}
	}
}
}