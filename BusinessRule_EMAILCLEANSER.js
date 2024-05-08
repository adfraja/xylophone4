/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "EMAILCLEANSER",
  "type" : "BusinessAction",
  "setupGroups" : [ "GlobalBusinessRulesRoot" ],
  "name" : "Email Data Cleansing",
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "e",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "EmailField",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (logger,node,e) {
var dc = node.getDataContainerByTypeID('EmailDataContainer').getDataContainerObject();

if (dc != null)
{ var space = node.getDataContainerByTypeID('EmailDataContainer').getDataContainerObject().getValue(e.getID()).getSimpleValue();
  if(space != null)
  {
  const email=space.replaceAll("\\s+","");
  logger.info(email)
  const regex1=/^(?!.{64,})([a-zA-Z0-9][!#$%&'*+-\/=?^_`{|}~]?(?!.*[\!\#\$\%\&\'\*\$\£\*\+\/\?\^\`\{\|\}\~]{2})(?!.*[\\\"\£\(\)\;\:\=\¬\,\<\>]{1}).*[a-zA-Z0-9_-]@[A-Za-z0-9.-]+\.[A-Za-z]{2,10})+$/;
  const regex2=/^([A-Za-z]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10})+$/;
  var email_check1 = email.match(regex1);
  var email_check2 = email.match(regex2);
  logger.info(email_check1)
  logger.info(email_check2)
  if (email_check1 == null && email_check2 == null)
  {
  node.getDataContainerByTypeID('EmailDataContainer').getDataContainerObject().getValue(e.getID()).setSimpleValue(null);
  }
  else
  {
  	logger.info("setting email in data container")
  	logger.info(email)
 	 node.getDataContainerByTypeID('EmailDataContainer').getDataContainerObject().getValue(e.getID()).setSimpleValue(email);	
	logger.info("Reading email from datacontainer")
 	 logger.info(node.getDataContainerByTypeID('EmailDataContainer').getDataContainerObject().getValue(e.getID()).getSimpleValue())
  
   }
  }
  }
  
  


}