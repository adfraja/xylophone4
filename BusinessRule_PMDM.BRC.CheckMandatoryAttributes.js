/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRC.CheckMandatoryAttributes",
  "type" : "BusinessCondition",
  "setupGroups" : [ "PMDM.BusinessRuleConditions" ],
  "name" : "Check Mandatory Attributes",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
var list = new java.util.ArrayList();
/*list.add("PMDM.AT.ProductStatus");*/
list.add("PMDM.AT.SupplierName");
list.add("PMDM.AT.SizePrimarySize");
list.add("PMDM.AT.SizeSecondarySize");
list.add("Gender");
list.add("PMDM.AT.Colour");
list.add("PMDM.AT.ArticleCategory");
list.add("PMDM.AT.ArticleTypes");
list.add("PMDM.AT.BMC");
list.add("PMDM.AT.Character");
list.add("PMDM.AT.CoreNewness");
list.add("PMDM.AT.DescriptionShort");
list.add("PMDM.AT.DotcomColourName");
list.add("PMDM.AT.LongItemDescription");
list.add("PMDM.AT.SizeRange");
list.add("PMDM.AT.ProductType");
list.add("PMDM.AT.ReprocessingComplexity");
list.add("SeasonLaunchPhase");
list.add("PMDM.AT.SellingPriceStructure");
list.add("PMDM.AT.ShortItemDescription");
list.add("PMDM.AT.StrokeCategory");
list.add("PMDM.AT.SupplierSeriesNo");
list.add("PMDM.AT.TradingSeasonYear");
list.add("PMDM.AT.TransitMode");

var listIterator = list.iterator();
while(listIterator.hasNext()){
var current = listIterator.next();
var attrValue = node.getValue(current).getSimpleValue();
if(attrValue == null){
var error1 = new errorMessage();
error1.value = current;
return error1;	 
}
}

return true;
}