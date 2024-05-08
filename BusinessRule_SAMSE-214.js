/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "SAMSE-214",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SAMSE-214",
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
  }, {
    "contract" : "AssetDownloadHomeBindContract",
    "alias" : "assetDownload",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,logger,assetDownload) {
try {
    assetDownload.downloadAssetContent(node, new java.net.URL("http://downloads-wilo-select.wilo.com/assets/WIV_WILO1454012.eps"));
} catch (err) {
    if (err.javaException instanceof java.io.IOException || err.javaException instanceof java.net.SocketException)
    {
        logger.info(err.message);
     }
     else {
          throw err;
     }
}
}