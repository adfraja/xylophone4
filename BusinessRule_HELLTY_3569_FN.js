/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "HELLTY_3569_FN",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "HELLTY_3569_FN",
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
  "binds" : [ ],
  "messages" : [ {
    "variable" : "completenessMessage",
    "message" : "{noOfAttributesWithValue} of {noOfAttributes} linked mandatory attributes have values.",
    "translations" : [ ]
  }, {
    "variable" : "errorMessage",
    "message" : "Product has no attribute links or no linked mandatory attributes.",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation",
  "functionReturnType" : "com.stibo.completenessscore.domain.metricresult.MetricBusinessFunctionResult",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "NODE",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (NODE,completenessMessage,errorMessage) {
var noOfAttributes = 0;
var noOfAttributesWithValue = 0;
var currentNode = NODE;

var checkedClassifications = [];
while (currentNode != null) {
  currentNode.queryClassificationProductLinks(etimClassificationProductLinkType).forEach(function (classificationProductLink) {
    var classification = classificationProductLink.getClassification();
    if (!checkedClassifications.includes("\"" + classification.getID() + "\"")) {
    	classification.getAttributeLinks().forEach(function (attributeLink) {
      var attribute = attributeLink.getAttribute();
  
      if (attributeLink.isMandatory() == true) {
        noOfAttributes++;
  
        if (currentNode.getValue(attribute.getID()).getSimpleValue() != null) {
          noOfAttributesWithValue++;
        }
      }
      return true;
  });
  checkedClassifications.push("\"" + classification.getID() + "\"");
    }
    
  return true;
  });
	currentNode = currentNode.getParent();
}

if (noOfAttributes != 0) {
	var message = new completenessMessage();
	message.noOfAttributesWithValue = noOfAttributesWithValue;
	message.noOfAttributes = noOfAttributes;

	var result = new com.stibo.completenessscore.domain.metricresult.MetricBusinessFunctionResult();
	return result.withScore((noOfAttributesWithValue / noOfAttributes) * 100).withMessage(NODE, message);
}

var message = new errorMessage();
var result = new com.stibo.completenessscore.domain.metricresult.MetricBusinessFunctionResult();
return result.setNotApplicable().withScore(0).withMessage(NODE, message);
}