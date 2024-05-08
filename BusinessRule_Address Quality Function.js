/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "Address Quality Function",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "Address Quality Function",
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
  "pluginId" : "JavaScriptBusinessFunctionWithBinds",
  "binds" : [ {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "com.stibo.completenessscore.domain.metricresult.MetricBusinessFunctionResult",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (logger,node) {
var result = new com.stibo.completenessscore.domain.metricresult.MetricBusinessFunctionResult();


var mainAddress = node.getDataContainerByTypeID("MainAddressDataContainer");
if(mainAddress == null) {
	return result.withScore(0);
}

var dcInstance = mainAddress.getDataContainerObject();
if(dcInstance == null) {	
	return result.withScore(0);
}

var value = dcInstance.getValue("QualityIndex").getSimpleValue();
   

if ("A".equals(value)) {
	return result.withScore(100);
}
if ("B".equals(value)) {
	return result.withScore(80);
}
if ("C".equals(value)) {
	return result.withScore(60);
}
if ("D".equals(value)) {
	return result.withScore(40);
}
if ("E".equals(value)) {
	return result.withScore(20);
}
if (value==null) {
	return result.withScore(0);
}

}