/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "SAINT-2578_BC",
  "type" : "BusinessCondition",
  "setupGroups" : [ "DRAJ_BC" ],
  "name" : "SAINT-2578_BC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "drak_sku" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "SimpleValueBindContract",
    "alias" : "SAINT2578_LOV_Y_N",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "SAINT-2578_LOV_Y_N",
    "description" : null
  }, {
    "contract" : "SimpleValueBindContract",
    "alias" : "SAINT2578_ATT",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "SAINT-2578_ATT",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (SAINT2578_LOV_Y_N,SAINT2578_ATT) {
if(SAINT2578_LOV_Y_N == "Yes"){
    if(SAINT2578_ATT != null){
        return true;
    }
    else{
       return "If SAINT-2578_LOV_Y_N is Yes, theSAINT-2578_ATT must be filled in";
    }
}
else{
    return false;
}
}