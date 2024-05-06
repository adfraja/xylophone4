/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "BA_SupplierReplicationMergeAction_PO",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Supplier Replication Merge Action PO",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SupplierPurchasingData" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "PartySupportLibrary",
    "libraryAlias" : "partyLib"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "SurvivorshipSourcesBindContract",
    "alias" : "srcs",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "goldenObj",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "partnerFunctionsReference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "REF_SupplierPurchasingDataToSupplier",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,srcs,goldenObj,partnerFunctionsReference,partyLib) {
var sourceObjIt = srcs.iterator()
while(sourceObjIt.hasNext()){
	sourceObj = sourceObjIt.next();
	logger.info("sourceObj in Purch-- Raul"+sourceObj.getID());
	partyLib.deleteEmptyDataContainerRow(goldenObj, step, "ATC_AdditionalTexts", "AT_PO_TextDescription");
	syncSupplierReferences(sourceObj, goldenObj, step, partnerFunctionsReference);
}

function syncSupplierReferences(sourceObj, goldenObj, step, referenceType){
	partyLib.deleteSupplierReferences(sourceObj, goldenObj, step, referenceType);
	createReferencesFromSourceObject(goldenObj, sourceObj, step, referenceType);
}

function createReferencesFromSourceObject(goldenObj, sourceObj, step, referenceType){
	var sourceReferences = sourceObj.getReferences(referenceType);
	for(var i=0; i<sourceReferences.size(); i++) {
		var target = sourceReferences.get(i).getTarget();
		logger.info("Web Service PO target"+target.getID());
		var flag = sourceReferences.get(i).getValue("AT_ReplicationActionFlag").getID()+""
		try{
			if (flag == "C" || flag == "U"){
				var sourcePartnerFunctions = sourceReferences.get(i).getValue("AT_SuplPartnerFunction").getSimpleValue();
				goldenObj.createReference(target, referenceType);
				setPartnerFunctions(goldenObj, step, referenceType, target.getID(), sourcePartnerFunctions);
			}
		}
		catch (e){
			log.info("Exception in match and merge action : "+e);
		}
	}
}
function setPartnerFunctions(goldenObj, step, referenceType, sourceTargetID, sourcePartnerFunctions) {
	var goldenObjReferences = goldenObj.getReferences(referenceType);
	for(var i=0; i<goldenObjReferences.size(); i++) {
		var targetID = goldenObjReferences.get(i).getTarget().getID();
		if(sourceTargetID == targetID) {
			goldenObjReferences.get(i).getValue("AT_SuplPartnerFunction").setSimpleValue(null);
			goldenObjReferences.get(i).getValue("AT_SuplPartnerFunction").setSimpleValue(sourcePartnerFunctions);
			break;
		}
	}
}
}