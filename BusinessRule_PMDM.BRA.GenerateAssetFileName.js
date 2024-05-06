/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.GenerateAssetFileName",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "Generate Asset File Name",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "PMDM.PRD.InternalMasterProduct", "PMDM.PRD.InternalSourceRecord", "ProductImage", "ProductVideo" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "StrokeNumberRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PMDM.ERT.StrokeNumber",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,StrokeNumberRefType) {
var referenceTypeIDs = ["PMDM.IDRT.PrimaryProductImage","Alternative", "Fabric", "Cut_Out", "Video"];


/*for (var i = 0; i < referenceTypeIDs.length; i++) {
var referenceTypeID = referenceTypeIDs[i];
node.queryReferencedBy(null).forEach(
function(reference) {
			if (referenceTypeID  = reference.getReferenceType().getID()){
				log.info("referenceTypeID = " + referenceTypeID);
				var source = reference.getSource();
				log.info("source = " + source);
				var shotType = reference.getValue("PMDM.AT.ShotType").getSimpleValue();			
                    calculateAssetFileName(source,shotType);
                   			
			}
	     return true;
     }

);
}*/

for (var i = 0; i < referenceTypeIDs.length; i++) {
var referenceTypeID = referenceTypeIDs[i];
logger.warning("referenceTypeID = " + referenceTypeID);
var referenceType = manager.getReferenceTypeHome().getReferenceTypeByID(referenceTypeID);
var references = node.getReferences(referenceType).iterator();
while(references.hasNext()){
var referenceTarget = references.next().getTarget();
logger.warning("referenceTarget = " + referenceTarget);
var shotType = node.getValue("PMDM.AT.ShotType").getSimpleValue();	

var finalValue = calculateAssetFileName(shotType,referenceTarget);
logger.warning("Final value test = " + finalValue);
referenceTarget.setName(finalValue);
referenceTarget.getValue("PMDM.AT.PDS.AssetFileName").setSimpleValue(finalValue);

var modelHeight = node.getValue("PMDM.AT.ModelHeight").getSimpleValue();
logger.info("modelHeight = " + modelHeight);
if(modelHeight){
referenceTarget.getValue("PMDM.AT.ModelHeight").setSimpleValue(modelHeight);
}

var modelSize = node.getValue("PMDM.AT.ModelSize").getSimpleValue();
if(modelSize){
referenceTarget.getValue("PMDM.AT.ModelSize").setSimpleValue(modelSize);	
}	
}
}


function calculateAssetFileName(shotType,referenceTarget){
/*var businessUnit = node.getValue("PMDM.AT.BusinessUnit").getSimpleValue();
if(businessUnit){
var bSplitValue = businessUnit.split("-");
}
var bFinalValue = bSplitValue[1];*/

var parent = node.getParent().getParent().getParent().getParent();
var parentName = parent.getName().split(" ");
var firstNamePart = parentName[0];

var dotcomColorName = node.getValue("PMDM.AT.Colour").getID();
var tradingSeasonYear = node.getValue("PMDM.AT.TradingSeasonYear").getSimpleValue();
var assetExtension = referenceTarget.getValue("asset.extension").getSimpleValue();

//var strokeNumber = node.getValue("PMDM.AT.StrokeNumber").getSimpleValue();
var strokeNumber = null;
var strokeReferences = node.getReferences(StrokeNumberRefType).iterator();
while(strokeReferences.hasNext()){
var currentReference = strokeReferences.next();
strokeNumber = currentReference.getTarget().getID();
}
var departmentID = null;
if(strokeNumber){
departmentID = strokeNumber.substring(0,3);
}
if(strokeNumber && departmentID){
var strokeNumSplit = strokeNumber.split(departmentID)
}
logger.warning("firstNamePart = " + firstNamePart);
logger.warning("departmentID = " + departmentID);
logger.warning("dotcomColorName = " + dotcomColorName);
logger.warning("tradingSeasonYear = " + tradingSeasonYear);
logger.warning("shotType = " + shotType);
logger.warning("assetExtension = " + assetExtension);

var concatenatedValue = "MS_" + firstNamePart + "_" + departmentID + "_" + strokeNumSplit[1]+ "_" + dotcomColorName + "_" + tradingSeasonYear + "_" + "EC_" + shotType + "." + assetExtension;
logger.info("concatenatedValue = " + concatenatedValue);
return concatenatedValue;

	
}


}