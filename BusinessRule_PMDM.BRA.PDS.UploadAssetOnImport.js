/*===== export metadata =====
{
  "contextId" : "DE-de",
  "workspaceId" : "Approved"
}
*/
/*===== business rule definition =====
{
  "id" : "PMDM.BRA.PDS.UploadAssetOnImport",
  "type" : "BusinessAction",
  "setupGroups" : [ "PMDM.BusinessRuleActions" ],
  "name" : "PDX: Upload Asset On Import",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Asset user-type root", "InstallationManual", "OwnersManual", "ProductImage" ],
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
    "alias" : "asset",
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
exports.operation0 = function (asset,manager) {
"use strict";
var FileNotExist = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BRA.PDS.UploadA_FileNotExist").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'File (%s) does not exist'
var InvalidUploadPath = manager.getEntityHome().getEntityByID("SysMsg_PMDM.BRA.PDS.Up_InvalidUploadPath").getValue("PMDM.AT.SystemMessage").getSimpleValue(); // 'Invalid upload source path'

var basePath = java.lang.System.getProperty("Tagglo.UploadDir.ASSETS");
var filename = asset.getValue("PMDM.AT.PDS.AssetFileName").getSimpleValue();

var baseDir = new java.io.File(basePath);
var assetFile = new java.io.File(baseDir, filename);

if (!assetFile.exists()) {
	var message = (FileNotExist+ "").replace("%s", filename); // 'File (%s) does not exist'
	throw(message);
}
if (!assetFile.getParentFile().equals(baseDir)) {
	throw InvalidUploadPath;
}

var fis = new java.io.FileInputStream(assetFile);
asset.upload(fis, filename);
fis.close();
}