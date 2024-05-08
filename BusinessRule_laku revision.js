/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "laku revision",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "laku revision",
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
function getString(revision) {
	const name = revision.getName()
	const createdDate = java.lang.String.format("%tF", revision.getCreatedDate())
	return name + '/' + createdDate
}
const tailRevision = node.getTailRevision()
const revisions = node.getRevisions()
const oldestRevision = revisions.get(revisions.size() - 1)
logger.info('tailRevision: ' + getString(tailRevision) + ', oldestRevision=' + getString(oldestRevision))

}