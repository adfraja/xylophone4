/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PhoneQualityFunction",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "Phone Quality Function",
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
exports.operation0 = function (node) {
var result = new com.stibo.completenessscore.domain.metricresult.MetricBusinessFunctionResult();

var nodeTitle = node.getTitle();

	var multiPhone = node.getDataContainerByTypeID("PhoneDataContainer");
	dcCollection = multiPhone.getDataContainers();
	if(dcCollection != null) {
		// We have instances of multi valued phone data containers 
		iter = dcCollection.iterator();
		var sum = 0;
		var count = 0;
		if(!iter.hasNext()) {
			return result.withScore(0);
		}
		
		while(iter.hasNext()){
			var dcInstance = iter.next().getDataContainerObject();			
			var quality = getInstanceQuality(dcInstance);
			//logger.info("Element quality: " + quality);
			count += 1;
			sum = sum + quality;
		}
		return result.withScore(sum/count);
	}

	// We will try single valued phones (prospects)
	
	var singlePhone = node.getDataContainerByTypeID("SinglePhone");
	
	if(singlePhone == null) {
		logger.info("Evaluating Single Phone of "+nodeTitle+" - no SinglePhone Data Container Type available");		
		return result.withScore(0);
	}
	
	dcInstance = singlePhone.getDataContainerObject()
	return result.withScore(getInstanceQuality(dcInstance));


function getInstanceQuality(dcInstance) {

			if(dcInstance == null) {
				logger.info("Evaluating Phone of "+nodeTitle+" - no phone number DC instance");
				return 0;
			}

			var qualityValue = dcInstance.getValue("Manual Quality Evaluation").getSimpleValue();
			if(qualityValue == null) {
				logger.info("Evaluating Phone of "+nodeTitle+" - no manual quality was set for number - assuming average quality");
				return 50;
			}
			if ("1 - Very Poor".equals(qualityValue)) {
				return 0;
			}
			if ("2 - Poor".equals(qualityValue)) {
				return 25;
			}
			if ("3 - Acceptable".equals(qualityValue)) {
				return 50;
			}
			if ("4 - Good".equals(qualityValue)) {
				return 75;
			}
			if ("5 - Very Good".equals(qualityValue)) {
				return 100;
			}


		}
}