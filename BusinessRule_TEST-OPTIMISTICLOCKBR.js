/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "TEST-OPTIMISTICLOCKBR",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TEST-OPTIMISTICLOCKBR",
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
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,logger) {
/**
 *
 * @param {string} supplierCode
 * @return {com.stibo.core.domain.entity.Entity | null}
 */
function findSupplierEntityBySupplierCode(supplierCode)
{
    return manager.getEntityHome().getEntityByID(supplierCode);
}

var supplier = findSupplierEntityBySupplierCode("SAMSE_161_TestEntity");
log.info(supplier);
logger.info("START");
java.lang.Thread.sleep(30000);
node.createReference(supplier, "SAMSE_161_Entity_Ref");
logger.info("END");
}