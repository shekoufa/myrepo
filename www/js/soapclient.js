/*****************************************************************************\

 Javascript "SOAP Client" library

 @version: 1.4 - 2005.12.10
 @author: Matteo Casati, Ihar Voitka - http://www.guru4.net/
 @description: (1) SOAPClientParameters.add() method returns 'this' pointer.
 (2) "_getElementsByTagName" method added for xpath queries.
 (3) "_getXmlHttpPrefix" refactored to "_getXmlHttpProgID" (full
 ActiveX ProgID).

 @version: 1.3 - 2005.12.06
 @author: Matteo Casati - http://www.guru4.net/
 @description: callback function now receives (as second - optional - parameter)
 the SOAP response too. Thanks to Ihar Voitka.

 @version: 1.2 - 2005.12.02
 @author: Matteo Casati - http://www.guru4.net/
 @description: (1) fixed update in v. 1.1 for no string params.
 (2) the "_loadWsdl" method has been updated to fix a bug when
 the wsdl is cached and the call is sync. Thanks to Linh Hoang.

 @version: 1.1 - 2005.11.11
 @author: Matteo Casati - http://www.guru4.net/
 @description: the SOAPClientParameters.toXML method has been updated to allow
 special characters ("<", ">" and "&"). Thanks to Linh Hoang.

 @version: 1.0 - 2005.09.08
 @author: Matteo Casati - http://www.guru4.net/
 @notes: first release.

 var u='pirhadi';
 var lres=login(u,'24061364@mmm');
 console.debug(lres);
 var accts=getCustomerAccounts(lres.customerId,lres.bank,u,lres.sessionID);
 console.debug(accts);
 var stmt=ministatement(accts[0].bank+accts[0].branch+accts[0].module+accts[0].scheme+accts[0].accountNo,u,lres.sessionID)
 console.debug(stmt);

 var chk=chequeStatus(accts[0].bank+accts[0].branch+accts[0].module+accts[0].scheme+accts[0].accountNo,u,lres.sessionID)
 console.debug(chk);


 var ben=getBeneficiaryAccounts(u,lres.sessionID)
 console.debug(ben);




 \*****************************************************************************/
var pwd = '95700e3a92830ae20ce0bddb23a2c1178f96017d70362572be90e293598c6126';
var skey = '35fc015d9308f316bd524c824cce9cd56ea7e455c6fe5b37bf';
var uname = 'MOBILEAPP';
var vendor = 'MOBILEAPP';

function _sendSafetyPasswordSoap(safetyPass, username, callback){
    var action='mobileOTPSafetyPassInsertion';
    var pl = fillRequestParams(action, 'MobileOTPSafetyWSReq_1',{loginId: username, safetyPassword: safetyPass});
    SOAPClient.invoke(url,action,pl,true,callback);

}
function _register(customerId, username, mobileNo,callback){
    if(mobileNo.length > 10){
        mobileNo = mobileNo.substr(mobileNo.length - 10);
    }
	var action='mobileOTPRegistration';
	var pl = fillRequestParams(action, 'MobileOTPRegWSReq_1', {loginUserId: username, cutomerId: customerId, mobileNo: mobileNo})
	SOAPClient.invoke(url, action, pl, true,callback);
}
function login(username, password,callback) {
    var action = 'validateUserDetails';
    var pl = fillRequestParams(action, 'MobileUserValidationRequest_1', {userId: username, userPassword: CryptoJS.SHA256(password).toString()});
    SOAPClient.invoke(url, action, pl, true,callback);
}
function getTimestamp() {
    var d = new Date();
    return lpad(d.getDate()) + lpad(d.getMonth() + 1) + lpad(d.getFullYear(), 4) + lpad(d.getHours()) + lpad(d.getMinutes()) + lpad(d.getSeconds()) + lpad(d.getMilliseconds(), 3);
}
function lpad(no, len) {
    if (!len)
        len = 2;
    var res = '' + no;
    while (res.length < len)
        res = '0' + res;
    return res;
}
function calcChecksum(action, additionalData) {
    var beforeSign = skey + '#' + vendor + '#' + action + '#' + uname + '#' + pwd;
    if(action == 'mobileOTPRegistration'){
        beforeSign += '#' + additionalData['cutomerId'];
        beforeSign += '#' + additionalData['mobileNo'];
    }
    if(action == 'mobileOTPSafetyPassInsertion'){
        beforeSign += '#' + additionalData['loginId'];
        beforeSign += '#' + additionalData['safetyPassword'];
    }
	if (action == 'validateUserDetails') {
        beforeSign += '#' + additionalData['userId'];
        beforeSign += '#' + additionalData['userPassword'];
    }
    if (action == 'getCustomerInfo') {
        beforeSign += '#' + additionalData['bank'];
        beforeSign += '#' + additionalData['customerId'];
    }
    if (action == 'getMiniStatement') {
        beforeSign += '#' + additionalData['acctNo'];
    }
    if (action == 'getChequeStatus') {
        beforeSign += '#' + additionalData['acctNo'];
    }
    if (action == 'sendChequeBookRequest') {
        beforeSign += '#' + additionalData['accNo'];
    }
    if (action == 'getAccountDetailInfo') {
        beforeSign += '#' + additionalData['acctNo'];
    }
    if (action == 'doFundTransfer') {
        beforeSign += '#' + additionalData['drAccount'];
    }
    if (action == 'doMobileFundTransfer') {
        beforeSign += '#' + additionalData['drAccount'];
    }
    if (action == 'paybill') {
        beforeSign += '#' + additionalData['drAccount'];
    }
    if (action == 'getBeneficiaryDetails') {
        beforeSign += '#' + additionalData['loginUserId'];
        beforeSign += '#' + additionalData['type'];
    }
    if (action == 'billPaySatus') {
        beforeSign += '#' + additionalData['billId'];
        beforeSign += '#' + additionalData['payId'];
    }
    if (action == 'userFeedBackRegistration') {
        beforeSign += '#' + additionalData['customerName'];
        beforeSign += '#' + additionalData['contactNumber'];
        beforeSign += '#' + additionalData['subject'];
    }

    return CryptoJS.SHA256(beforeSign).toString();
}
function fillRequestParams(action, envelopeName, additionalData) {
    var pl = new SOAPClientParameters();
    pl.add('action', action);
    pl.add('passwd', pwd);
    pl.add('vendor', vendor);
    pl.add('uname', uname);
    pl.add('timeStamp', getTimestamp());
    if (additionalData) {
        for (var key in additionalData)
            pl.add(key, additionalData[key]);
    }
    pl.add('checkSum', calcChecksum(action, additionalData));
    var pl2 = new SOAPClientParameters();
    pl2.add(envelopeName, pl.toXml(true));
    return pl2;
}

function SOAPClientParameters() {
    var _pl = new Array();
    this.add = function (name, value) {
        _pl[name] = value;
        return this;
    }
    this.toXml = function (isXml) {
        var xml = "";
        for (var p in _pl) {
            if (typeof(_pl[p]) != "function") {
                var val = _pl[p].toString().replace(/&/g, "&amp;");
                //if(!isXml)
                // val=val.replace(/</g, "&lt;").replace(/>/g, "&gt;")
                xml += "<" + p + ">" + val + "</" + p + ">";
            }
        }
        return xml;
    }
}

function SOAPClient() {
}

SOAPClient.invoke = function (url, method, parameters, async, callback) {
    lastActivity=new Date().getTime();
    if (async)
        SOAPClient._loadWsdl(url, method, parameters, async, callback);
    else
        return SOAPClient._loadWsdl(url, method, parameters, async, callback);
}

// private: wsdl cache
SOAPClient_cacheWsdl = new Array();

// private: invoke async
SOAPClient._loadWsdl = function (url, method, parameters, async, callback) {
    // load from cache?
    var wsdl = SOAPClient_cacheWsdl[url];
    if (wsdl + "" != "" && wsdl + "" != "undefined")
        return SOAPClient._sendSoapRequest(url, method, parameters, async, callback, wsdl);
    // get wsdl
    var xmlHttp = SOAPClient._getXmlHttp();
    xmlHttp.open("GET", url + "?wsdl", async);
    xmlHttp.setRequestHeader('Content-Type', 'text/plain');
    if (async) {
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                SOAPClient._onLoadWsdl(url, method, parameters, async, callback, xmlHttp);
            }
        }
    }
    xmlHttp.timeout=4000;
    xmlHttp.ontimeout=function(as){
        $.mobile.loading("hide");
        alert('متاسفانه پاسخی از مرکز دریافت نشد');
    };
    xmlHttp.send(null);
    if (!async)
        return SOAPClient._onLoadWsdl(url, method, parameters, async, callback, xmlHttp);
}
SOAPClient._onLoadWsdl = function (url, method, parameters, async, callback, req) {
    var wsdl = req.responseXML;
    SOAPClient_cacheWsdl[url] = wsdl;	// save a copy in cache
    return SOAPClient._sendSoapRequest(url, method, parameters, async, callback, wsdl);
}
SOAPClient._sendSoapRequest = function (url, method, parameters, async, callback, wsdl) {
    if(!wsdl || wsdl==undefined){
        alert('دسترسی به اینترنت مقدور نمیباشد');
        callback({status:'99',errorMsg:'دسترسی به اینترنت مقدور نمیباشد'});
        return;
    }
    // get namespace
    var ns = (wsdl.documentElement.attributes["targetNamespace"] + "" == "undefined") ? wsdl.documentElement.attributes.getNamedItem("targetNamespace").nodeValue : wsdl.documentElement.attributes["targetNamespace"].value;
    // build SOAP request
    var sr =
        "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<soap:Envelope " +
        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
        "xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
        "<soap:Body>" +
        "<" + method + " xmlns=\"" + ns + "\">" +
        parameters.toXml() +
        "</" + method + "></soap:Body></soap:Envelope>";
    // send request
    var xmlHttp = SOAPClient._getXmlHttp();
    xmlHttp.open("POST", url, async);
    //xmlHttp.setRequestHeader('Content-Type', 'text/plain');
    var soapaction = ((ns.lastIndexOf("/") != ns.length - 1) ? ns + "/" : ns) + method;
    xmlHttp.setRequestHeader("SOAPAction", soapaction);
    xmlHttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    if (async) {
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4)
                SOAPClient._onSendSoapRequest(method, async, callback, wsdl, xmlHttp);
        }
    }
    xmlHttp.timeout=4000;
    xmlHttp.ontimeout=function(as){
        $.mobile.loading("hide");
        alert('متاسفانه پاسخی از مرکز دریافت نشد');
    };
    xmlHttp.send(sr);
    if (!async)
        return SOAPClient._onSendSoapRequest(method, async, callback, wsdl, xmlHttp);
}
SOAPClient._onSendSoapRequest = function (method, async, callback, wsdl, req) {
    var o = null;
    var nd = SOAPClient._getElementsByTagName(req.responseXML, "result");
    if(!nd || nd==undefined){
        return;
    }
    if (nd.length == 0) {
        if (req.responseXML.getElementsByTagName("faultcode").length > 0)
            throw new Error(500, req.responseXML.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue);
    }
    else if (nd.length == 1)
        o = SOAPClient._soapresult2object(nd[0], wsdl);
    else {
        o = [];
        var j = 0;
        for (var i = 0; i < nd.length; i++) {
            var r = SOAPClient._soapresult2object(nd[i], wsdl);
            if (r) {
                o[j] = r
                j++;
            }
        }
        if (o.length == 1)
            o = o[0];
    }
    if (callback)
        callback(o, req.responseXML);
    if (!async)
        return o;
}

// private: utils
SOAPClient._getElementsByTagName = function (document, tagName) {
    try {
        // trying to get node omitting any namespaces (latest versions of MSXML.XMLDocument)
        return document.selectNodes(".//*[local-name()=\"" + tagName + "\"]");
    }
    catch (ex) {
    }
    // old XML parser support
    try {
        return document.getElementsByTagName(tagName);
    }catch (ex){

    }
}

SOAPClient._soapresult2object = function (node, wsdl) {
    return SOAPClient._node2object(node, wsdl);
}
SOAPClient._node2object = function (node, wsdl) {
    // null node
    if (node == null)
        return null;
    // text node
    if (node.nodeType == 3 || node.nodeType == 4)
        return SOAPClient._extractValue(node, wsdl);
    // leaf node
    if (node.childNodes.length == 1 && (node.childNodes[0].nodeType == 3 || node.childNodes[0].nodeType == 4))
        return SOAPClient._node2object(node.childNodes[0], wsdl);
    var isarray = SOAPClient._getTypeFromWsdl(node.nodeName, wsdl).toLowerCase().indexOf("arrayof") != -1;
    // object node
    if (!isarray) {
        var obj = null;
        if (node.hasChildNodes())
            obj = new Object();
        for (var i = 0; i < node.childNodes.length; i++) {
            var p = SOAPClient._node2object(node.childNodes[i], wsdl);
            obj[node.childNodes[i].nodeName] = p;
        }
        return obj;
    }
    // list node
    else {
        // create node ref
        var l = new Array();
        for (var i = 0; i < node.childNodes.length; i++)
            l[l.length] = SOAPClient._node2object(node.childNodes[i], wsdl);
        return l;
    }
    return null;
}
SOAPClient._extractValue = function (node, wsdl) {
    var value = node.nodeValue;
    switch (SOAPClient._getTypeFromWsdl(node.parentNode.nodeName, wsdl).toLowerCase()) {
        default:
        case "s:string":
            return (value != null) ? value + "" : "";
        case "s:boolean":
            return value + "" == "true";
        case "s:int":
        case "s:long":
            return (value != null) ? parseInt(value + "", 10) : 0;
        case "s:double":
            return (value != null) ? parseFloat(value + "") : 0;
        case "s:datetime":
            if (value == null)
                return null;
            else {
                value = value + "";
                value = value.substring(0, value.lastIndexOf("."));
                value = value.replace(/T/gi, " ");
                value = value.replace(/-/gi, "/");
                var d = new Date();
                d.setTime(Date.parse(value));
                return d;
            }
    }
}
SOAPClient._getTypeFromWsdl = function (elementname, wsdl) {
    var ell = wsdl.getElementsByTagName("s:element");	// IE
    if (ell.length == 0)
        ell = wsdl.getElementsByTagName("element");	// MOZ
    for (var i = 0; i < ell.length; i++) {
        if (ell[i].attributes["name"] + "" == "undefined")	// IE
        {
            if (ell[i].attributes.getNamedItem("name") != null && ell[i].attributes.getNamedItem("name").nodeValue == elementname && ell[i].attributes.getNamedItem("type") != null)
                return ell[i].attributes.getNamedItem("type").nodeValue;
        }
        else // MOZ
        {
            if (ell[i].attributes["name"] != null && ell[i].attributes["name"].value == elementname && ell[i].attributes["type"] != null)
                return ell[i].attributes["type"].value;
        }
    }
    return "";
}
// private: xmlhttp factory
SOAPClient._getXmlHttp = function () {
    try {
        if (window.XMLHttpRequest) {
            var req = new XMLHttpRequest();
            // some versions of Moz do not support the readyState property and the onreadystate event so we patch it!
            if (req.readyState == null) {
                req.readyState = 1;
                req.addEventListener("load",
                    function () {
                        req.readyState = 4;
                        if (typeof req.onreadystatechange == "function")
                            req.onreadystatechange();
                    },
                    false);
            }
            return req;
        }
        if (window.ActiveXObject)
            return new ActiveXObject(SOAPClient._getXmlHttpProgID());
    }
    catch (ex) {
    }
    throw new Error("Your browser does not support XmlHttp objects");
}
SOAPClient._getXmlHttpProgID = function () {
    if (SOAPClient._getXmlHttpProgID.progid)
        return SOAPClient._getXmlHttpProgID.progid;
    var progids = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
    var o;
    for (var i = 0; i < progids.length; i++) {
        try {
            o = new ActiveXObject(progids[i]);
            return SOAPClient._getXmlHttpProgID.progid = progids[i];
        }
        catch (ex) {
        }
        ;
    }
    throw new Error("Could not find an installed XML parser");
}