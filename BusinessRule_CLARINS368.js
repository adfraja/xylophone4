/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "CLARINS368",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CLARINS368",
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
    "alias" : "golden",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "SurvivorshipSourcesBindContract",
    "alias" : "srcObjs",
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
    "alias" : "lookup",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (golden,srcObjs,logger,lookup) {
//binds
//golden --> Object/product
//srcObjs --> Survivorship Rule Source Objects

var attr = golden.getManager().getAttributeHome().getAttributeByID('Income');
var goldenValue = golden.getValue(attr.getID()).getSimpleValue();
var hasGoldenValue = (goldenValue != null);
for (var it = srcObjs.iterator(); it.hasNext();) {
    var src = it.next();
    var value = src.getValue(attr.getID());
    var srcValue = value.getSimpleValue();
    var hasSrcValue = (srcValue != null);
    if (hasSrcValue) {
        if (!hasGoldenValue || java.lang.Integer.parseInt(goldenValue) < java.lang.Integer.parseInt(srcValue)) {
            golden.setSimpleValue(attr, srcValue);
            goldenValue = srcValue;
        }
    }
}
}