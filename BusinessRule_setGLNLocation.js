/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "setGLNLocation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "setGLNLocation",
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
    "contract" : "AttributeBindContract",
    "alias" : "glnAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "PMDM.AT.ProviderGLN",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "isProductOnboardingGlnAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "isProductOnboardingGLN",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "selfServiceReferenceType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "SupplierAccount",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "locationClass",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "SupplierLocationClassification",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "locationsRoot",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "SupplierLocationsClassification",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "activeFlag",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "supplierEntityToGlnClassificationReferenceType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "SupplierToSupplierLocationClassification",
    "description" : null
  } ],
  "messages" : [ {
    "variable" : "glnKeyError",
    "message" : "wqporej3oirr4ef",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,glnAttr,isProductOnboardingGlnAttr,selfServiceReferenceType,locationClass,locationsRoot,activeFlag,supplierEntityToGlnClassificationReferenceType,glnKeyError) {
/* Specification
On current node:
- Evaluate 'Is Product Onboarding GLN' and 'GLN' attributes
- If Is Product Onboarding GLN=yes and GLN is not empty, then
- Look up existing GLN classifications with 'GLN' value
- If 'GLN' value exists, then evaluate existing GLN classification's supplier
-If supplier equals current node's supplier, then update (what are we updating?)
-else if supplier does not equal current node's supplier, then stop and throw error message (TBD)
- If 'GLN' value does not exist as a GLN classfication, then
- Create GLN classification with 'GLN' value and reference to current node's supplier classification
- If Is Product Onboarding GLN=no and GLN is not empty, then
- Look up existing GLN classification with 'GLN' value
- Set 'Active'=N on GLN classification //this assumes the GLN will always be existing and we do not need to worry about having to create a new GLN - need to clarify this
*///Bind glnOnboardingFlag = attribute ID isProductOnboardingGLN
//Bind glnAttr = attribute ID GLN
//Bind activeFlag = attribute ID isActive**
//Bind supplierClassRef = reference ID SupplierEntitiesReference
//Bind locationClass = object type ID SupplierLocationClassification
//Bind locationsRoot = object type ID SupplierLocationsClassification**
//Bind selfServiceReferenceType = reference ID SupplierEntitiesReferencevar prodOnboardingGLN = node.getValue(glnOnboardingFlag.getID()).getSimpleValue();
var pdxWF = manager.getWorkflowHome().getWorkflowByID("PDXInvitationHandling");

if (pdxWF){
var gln = node.getValue(glnAttr.getID()).getSimpleValue();
var isProductOnboardingGln = isProductOnboardingGlnEntity(node);
var existingGlnClassification = manager.getNodeHome().getObjectByKey("PMDM.Key.PDS.GLN", gln);
var supplierClassOfSupplierEntity = getSupplierClassificationFromSupplierEntity(node); //Get Supplier parent classification of supplier entities classification
if (existingGlnClassification) {
   if (existingGlnClassification.getParent().getParent().equals(supplierClassOfSupplierEntity)) {
       createGlnEntityToGlnClassificationReference(node, existingGlnClassification);
       alignIsProductOnboardingWithGlnClassificationActiveFlag(isProductOnboardingGln, existingGlnClassification);
    } else {
       //TODO change this to be a translatable message in the business condition
        throw "GLN " + existingGlnClassification + " already exists for different Supplier Self Service Classification with ID " + existingGlnClassification.getParent().getParent().getID() + ". Please enter a different GLN";
    }
} else if(isProductOnboardingGln) {
    var locationsBucket = getLocationsBucket(supplierClassOfSupplierEntity);
	var locationsBucketObType = locationsBucket.getObjectType().getID();
	var glnClassification = locationsBucket.createClassification(null, "SupplierLocationClassification");
    glnClassification.getValue(glnAttr.getID()).setSimpleValue(gln);
    glnClassification.setName(gln);
    createGlnEntityToGlnClassificationReference(node, glnClassification);
    alignIsProductOnboardingWithGlnClassificationActiveFlag(isProductOnboardingGln, glnClassification);
}
} else {
	return false;
}


function alignIsProductOnboardingWithGlnClassificationActiveFlag(isProductOnboardingGln, glnClassification) {
    if(!isProductOnboardingGln) {
        glnClassification.getValue(activeFlag.getID()).setSimpleValue("No");
    } else {
        glnClassification.getValue(activeFlag.getID()).setSimpleValue("Yes");
    }
}
function createGlnEntityToGlnClassificationReference(supplierEntity, glnClassification) {
    //TODO finish...
    var ref = supplierEntity.queryReferences(supplierEntityToGlnClassificationReferenceType).asList(1);
	if(ref.size() < 1){
        supplierEntity.createReference(glnClassification, supplierEntityToGlnClassificationReferenceType)
    } //else if(!ref.getTarget().equals(glnClassification)) {
        //TODO Discuss with PVMA what to do. Perhaps just move it?
    //}
}
function isProductOnboardingGlnEntity(glnEntity) {
    var isProductOnboardingGlnValue = node.getValue(isProductOnboardingGlnAttr.getID()).getSimpleValue();
    if(isProductOnboardingGlnValue && isProductOnboardingGlnValue.equals("Yes"/*TODO is this the right value of that LOV? Perhaps it has a value id?*/)) {
        return true;
    } else {
        return false;
    }
}
function getSupplierClassificationFromSupplierEntity(supplierEntity) {
    var supplierClassification = node.queryReferences(selfServiceReferenceType).asList(1);
	if(supplierClassification.size() >0){
		supplierClassification = supplierClassification.get(0).getTarget();
		return supplierClassification;
	} else{
		return null;
	}
}
function getLocationsBucket(supplierClassOfSupplierEntity) {
    var locationsBucket = null;
	log.info(supplierClassOfSupplierEntity);
	var temp1 = supplierClassOfSupplierEntity.getID(); //get the id of supplier classification i.e: "103294-CLS"
	//transform supplier classification id into locations bucket i.e: "103294-LCLS"
	var idArray = temp1.split("-");
	var newID = idArray[0] + "-LCLS";
	var locationsBucket = manager.getClassificationHome().getClassificationByID(newID);
	log.info("Location bucket =" + locationsBucket + "newID =" + newID);
    if(!locationsBucket) {
        throw "At least one object of Object Type "+locationsBucket.getID()+" should exist below "+supplierClassOfSupplierEntity.getID();
    }
	else {
		return locationsBucket;
	}
}

}