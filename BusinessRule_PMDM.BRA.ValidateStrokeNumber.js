/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.ValidateStrokeNumber",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "Validate Stroke Number",
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
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "StrokeNumberRefType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PMDM.ERT.StrokeNumber",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ {
    "variable" : "errorMessage",
    "message" : "The stroke number reference is wrong. Please update a valid stroke number.",
    "translations" : [ ]
  }, {
    "variable" : "errorMessage1",
    "message" : "This stroke number has already been assigned to another product. Please enter a different stroke number.",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,queryHome,StrokeNumberRefType,web,errorMessage,errorMessage1) {
var existingRecords = new java.util.ArrayList();
var existingStrokeNumbers = new java.util.ArrayList();
var productID = node.getValue("PMDM.AT.ProductID").getSimpleValue();
log.info("productID = " + productID);


if(productID){
var cond = com.stibo.query.condition.Conditions;
var objectType = manager.getObjectTypeHome().getObjectTypeByID("PMDM.PRD.InternalMasterProduct");
var productIdAttr = manager.getAttributeHome().getAttributeByID("PMDM.AT.ProductID");
var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
	cond.objectType(objectType)
	.and(cond.valueOf(productIdAttr).eq(productID))	
);
var queryWithConditions = querySpecification.execute();

queryWithConditions.forEach(
	function(res) {		
		if(res.getID() != node.getID()){
		existingRecords.add(res);
		log.info("res = " + res.getID());
		}
		return true;
	});

log.info("length = " + existingRecords.size());
}
if(existingRecords.size()>0){
randomProductId =  existingRecords.get(0);
log.info("randomProductId = " + randomProductId);
//Query to fetch the target of the reference "Stroke Number" of the current node
var currentNodeProductID = null;
var nodeReferences = node.getReferences(StrokeNumberRefType);
if(nodeReferences.size()>0){
var nodeReference = nodeReferences.get(0);
currentNodeProductID = nodeReference.getTarget();	
}

//Query to fetch the target of the reference "Stroke Number" of the product that contains same product ID number
var existingNodeProductID = null;
var randomReferences = randomProductId.getReferences(StrokeNumberRefType);
if(randomReferences.size()>0){
var randomNodeReference = randomReferences.get(0);
existingNodeProductID = randomNodeReference.getTarget();	
}

log.info("currentNodeProductID = " + currentNodeProductID);
log.info("existingNodeProductID = " + existingNodeProductID);
 	
if(currentNodeProductID && existingNodeProductID){
 if(!currentNodeProductID.equals(existingNodeProductID)){ 	
 	var msg = "A different stroke number is already assigned at this product level with a different colour. The stroke number in use is : " + existingNodeProductID;
 	web.showAlert("WARNING","",msg);
 }
}
}

else{
var strokeNumberRefEntity = null;

var nodeStrokeReferences = node.getReferences(StrokeNumberRefType);
if(nodeStrokeReferences.size()>0){
var nodeStrokeReference = nodeStrokeReferences.get(0);
strokeNumberRefEntity = nodeStrokeReference.getTarget();	
}

if(strokeNumberRefEntity){

var referencedByRefs = strokeNumberRefEntity.getReferencedBy();
var iter = referencedByRefs.iterator();
 while (iter.hasNext()) {
        var ref = iter.next();
        var refTypeID = ref.getReferenceTypeString();
        if(("PMDM.ERT.StrokeNumber").equals(refTypeID)){
		var EntSource = ref.getSource();
		if(EntSource){
          if(node.getID() != EntSource.getID()){
           existingStrokeNumbers.add(EntSource);
           }
          }
      }        
}	
}

if(existingStrokeNumbers.size()>0){
var errorMessage1 = new errorMessage1();
throw errorMessage1;	
}

}



}