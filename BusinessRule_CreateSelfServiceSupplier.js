/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "CreateSelfServiceSupplier",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Self Service Supplier",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Supplier" ],
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
    "alias" : "entity",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationBindContract",
    "alias" : "classificationsRoot",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "SupplierClassificationsRoot",
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "supplierUserGroupRoot",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "Suppliers",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "selfServiceReferenceType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "SupplierAccount",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "supplierClassificationObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "SupplierClassification",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "supplierEntitiesClassificationObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "SupplierEntitiesClassification",
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mailHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "entityAdminEmailAttribute",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "SupplierAdminEmail",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "supplierProductsClassificationObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "SupplierProductsClassification",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "supplierAssetsClassificationObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "SupplierAssetsClassification",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "supplierSelfServiceAdminUserAttribute",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "SupplierAdminUserName",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "supplierUserGroupUser",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "SupplierUser",
    "description" : null
  }, {
    "contract" : "UserGroupBindContract",
    "alias" : "supplierUserGroupAdmin",
    "parameterClass" : "com.stibo.core.domain.impl.GroupImpl",
    "value" : "SupplierAdmin",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "AdminEmail",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">SupplierAdminEmail</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">Admin Email</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "supplierGLNLocationsClassificationObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "SupplierLocationsClassification",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "recipientName",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">PDXInvitationName</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">Recipient Name</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ {
    "variable" : "NoEmail",
    "message" : "An email address must be provided",
    "translations" : [ ]
  }, {
    "variable" : "NoName",
    "message" : "A recipient name must be provided",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (entity,classificationsRoot,supplierUserGroupRoot,selfServiceReferenceType,supplierClassificationObjectType,supplierEntitiesClassificationObjectType,mailHome,entityAdminEmailAttribute,supplierProductsClassificationObjectType,supplierAssetsClassificationObjectType,supplierSelfServiceAdminUserAttribute,log,supplierUserGroupUser,supplierUserGroupAdmin,web,AdminEmail,supplierGLNLocationsClassificationObjectType,manager,recipientName,NoEmail,NoName) {
// Configuration
var SystemURL = "stcust-base.stibo.com";
var MasterWebUI = "SupplierOnboardingSelfServiceWebUI";
var SupplierWebUI = "SupplierWebUI";
var mainContext = "Context1";
var initiateSupplierLocationWorkflowID = "SupplierOnboardingSelfService";
var supplierReviewState = "SupplierReview";
// -------------------------------------------

var userGroupHome = entity.getManager().getGroupHome();
var userHome = entity.getManager().getUserHome();
var classificationHome = entity.getManager().getClassificationHome();

var supplierIDNoSpace = entity.getID().replace(' ', '');
var supplierIDWithSpace = entity.getName();

// Sanity checks:
var adminEmailAddress = AdminEmail;
var pdxWF = manager.getWorkflowHome().getWorkflowByID("PDXInvitationHandling");
if (pdxWF){
if(adminEmailAddress == null){
	throw new NoEmail();
}

var recipientPDXName = recipientName;
if(recipientPDXName == null){
	throw new NoName();
}}

// Create User Group
var groupID = supplierIDNoSpace + "-GRP";
var group = userGroupHome.getGroupByID(groupID);
if(!group) {​​
    group=supplierUserGroupRoot.createGroup(groupID);
}​​
group.setName(entity.getName());

// Create Supplier Classification Structure
var supplierClassificationID = supplierIDNoSpace + "-CLS";
var supplierClassification = classificationHome.getClassificationByID(supplierClassificationID);
var supplierRecipientEmail = manager.getAttributeHome().getAttributeByID("PDXInvitationEmail");
var supplierRecipientName = manager.getAttributeHome().getAttributeByID("PDXInvitationName");
if(supplierClassification && !supplierClassification.getObjectType().equals(supplierClassificationObjectType)) {​​
    throw "Classification with ID "+supplierClassificationID + " already exist, but does not have the expected Object Type"+supplierClassificationObjectType.getName()+". Unable to create supplier account";
}​​

if(!supplierClassification) {​​
    supplierClassification = classificationsRoot.createClassification(supplierClassificationID, supplierClassificationObjectType);
    classificationsRoot.approve();

}​​
supplierClassification.setName(entity.getName());
if (pdxWF){
supplierClassification.getValue(supplierRecipientEmail.getID()).setSimpleValue(AdminEmail);
supplierClassification.getValue(supplierRecipientName.getID()).setSimpleValue(recipientName);
}
    supplierClassification.approve();

supplierEntityClassificationID = supplierIDNoSpace+"-ECLS";
var supplierEntityClassification = classificationHome.getClassificationByID(supplierEntityClassificationID);
if(supplierEntityClassification && !supplierEntityClassification.getObjectType().equals(supplierEntitiesClassificationObjectType)) {​​
    throw "Classification with ID "+supplierEntityClassificationID + " already exist, but does not have the expected Object Type"+supplierEntityClassificationObjectType.getName()+". Unable to create supplier account";
}​​
if(!supplierEntityClassification) {​​
    supplierEntityClassification=supplierClassification.createClassification(supplierEntityClassificationID, supplierEntitiesClassificationObjectType);
}​
supplierEntityClassification.setName(supplierIDWithSpace + " Entities");​
	supplierEntityClassification.approve();

//GLN Location Classification
supplierGLNLocationsClassificationID = supplierIDNoSpace+"-LCLS";
var supplierGLNLocationsClassification = classificationHome.getClassificationByID(supplierGLNLocationsClassificationID);
if(supplierGLNLocationsClassification && !supplierGLNLocationsClassification.getObjectType().equals(supplierGLNLocationsClassificationObjectType)) {​​
    throw "Classification with ID "+supplierGLNLocationsClassificationID + " already exist, but does not have the expected Object Type"+supplierGLNLocationsClassificationObjectType.getName()+". Unable to create supplier account";
}​​
if(!supplierGLNLocationsClassification) {​​
    supplierGLNLocationsClassification=supplierClassification.createClassification(supplierGLNLocationsClassificationID, supplierGLNLocationsClassificationObjectType);
}​
supplierGLNLocationsClassification.setName(supplierIDWithSpace+" Locations");​
	supplierGLNLocationsClassification.approve();

//Product Classification
supplierProductClassificationID = supplierIDNoSpace+"-PCLS";
var supplierProductClassification = classificationHome.getClassificationByID(supplierProductClassificationID);
if(supplierProductClassification && !supplierProductClassification.getObjectType().equals(supplierProductsClassificationObjectType)) {​​
    throw "Classification with ID "+supplierProductClassificationID + " already exist, but does not have the expected Object Type"+supplierEntityClassificationObjectType.getName()+". Unable to create supplier account";
}​​
if(!supplierProductClassification) {​​
    supplierProductClassification=supplierClassification.createClassification(supplierProductClassificationID, supplierProductsClassificationObjectType);
}​
supplierProductClassification.setName(supplierIDWithSpace + " Products");
	supplierProductClassification.approve();​

supplierAssetClassificationID = supplierIDNoSpace+"-ACLS";
var supplierAssetClassification = classificationHome.getClassificationByID(supplierAssetClassificationID);
if(supplierAssetClassification && !supplierAssetClassification.getObjectType().equals(supplierAssetsClassificationObjectType)) {​​
    throw "Classification with ID "+supplierAssetClassification + " already exist, but does not have the expected Object Type"+supplierEntityClassificationObjectType.getName()+". Unable to create supplier account";
}​​
if(!supplierAssetClassification) {​​
    supplierAssetClassification=supplierClassification.createClassification(supplierAssetClassificationID, supplierAssetsClassificationObjectType);
}​
supplierAssetClassification.setName(supplierIDWithSpace + " Assets");​
	supplierAssetClassification.approve();


var selfServiceRefs = entity.getReferences(selfServiceReferenceType);
var hasExistingSelfServiceRef = false;
if(selfServiceRefs && selfServiceRefs.iterator().hasNext()) {​​
    var iter = selfServiceRefs.iterator();
    while(iter.hasNext()) {​​
        var ref = iter.next();
        if(!ref.getTarget().equals(supplierEntityClassification)) {​​
            ref.delete();
        }​​ else {​​
            hasExistingSelfServiceRef =true;
        }​​
    }​​
}​​
if(!hasExistingSelfServiceRef) {​​
    entity.createReference(supplierEntityClassification, selfServiceReferenceType);
}​​
var hasVendorRoot = false;
if(group.getVendorRoot()) {​​
    hasVendorRoot = true;
    if(!group.getVendorRoot().equals(supplierClassification)) {​​
        throw "Supplier User Group "+group.getID()+" already has supplier classification root"+ group.getVendorRoot().getID()+" It must be"+supplierClassification.getID()+". Unable to create self service supplier";
    }​​
}​​
if(!hasVendorRoot) {​​
    group.setVendorRoot(supplierClassification);
}​​

// Create Admin User for Supplier
var adminUsername = entity.getID() + "-Admin";
var adminUser = userHome.getUserByID(adminUsername); 
var newUser = false;
if(!adminUser) {​​
	newUser = true;
   var password = java.util.UUID.randomUUID().toString();
   adminUser=group.createUser(adminUsername, password, adminEmailAddress);
   adminUser.setName(supplierIDWithSpace + "-Admin");
   entity.getValue(supplierSelfServiceAdminUserAttribute.getID()).setSimpleValue(adminUsername);
}​​
if(!adminUser.getGroups().contains(supplierUserGroupAdmin)) {​​
    // Groups identified by binds
    supplierUserGroupUser.addUser(adminUser);    
    supplierUserGroupAdmin.addUser(adminUser);
}​​



if(adminEmailAddress && adminEmailAddress.equals(adminUser.getEMail())) {
	var mail = mailHome.mail();
	mail.from("noreply@acmecorporation.com", "Regarding "+entity.getName()+" supplier self service at Acme Corporation");
	mail.subject("Admin user initial login credentials");
	mail.addTo(adminEmailAddress);
	var mailDeeplink = "https://"+SystemURL+"/webui/"+SupplierWebUI+"#contextID="+mainContext+"&workspaceID=Main&selection="+entity.getID()+"&nodeType=entity&workflowID="+initiateSupplierLocationWorkflowID+"&stateID="+supplierReviewState+"&selectedTab=1376998866.0";
	if(newUser) {
		mail.plainMessage("From Acme Corporation \n\nDear admin of self service from "+entity.getName()+",\n\nHere are your initial login credentials for self service registration.\nUsername: "+adminUsername+"\nPassword: "+password+"\n\nGo to "+mailDeeplink+" to proceed.");
		web.showAlert("WARNING", "Self-service configuration has been create", "E-mail with login credentials has been sent to supplier admin with email "+adminEmailAddress+"\n\nMake sure to Submit to Supplier.");
	} else {
		mail.plainMessage("From Acme Corporation \n\nDear admin of self service from "+entity.getName()+",\n\nYour username for for self service registration is:\nUsername: "+adminUsername+"\n\nAs this username is existing and is associated to this email, your existing password is not included in this email. Should you not know your password, please contact suppliersupplier@acme.com\n\n\nGo to "+mailDeeplink+" to proceed.");
		web.showAlert("WARNING", "Self-service configuration has been create", "Admin user with ID"+adminUsername+" already existed.\n\nE-mail with login username, but no password has been sent to supplier admin with email "+adminEmailAddress+"\n\nMake sure to Submit to Supplier.");
	}
	mail.send();
} else {
	web.showAlert("WARNING", "E-mail not sent", "Self-service configuration has been create, but email has not been sent to user "+adminUser.getID()+".\n\nThe user was existing and has email "+adminUser.getEMail()+", which is different from the provided email "+adminEmailAddress+". \n\nTo proceed, please contact the the relevant users yourself");
}
}