var lastActivity=0;
var bank;
var sessionId;
var userId;
var acctNos = [];
var acctDetails = [];
var acctStatements = [];
var acctChqs = [];
var benAccts = [];
var curAcct;

var spanize = function (str) {
    return '<div>' + str + '</div>';
}

var scanBarcode = function () {

    var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    scanner.scan(function (result) {

        if (result && result.text) {
            var billCode = result.text.substr(0, 13);
            var payCode = result.text.substr(13);

            $('#billId').val(billCode);
            $('#payId').val(parseFloat(payCode));
        }
    });
}

function correctTranslations() {
    $('[data-content]').each(function () {
        var t = $(this);
        if (t.find('a').length)
            t = t.find('a');
        t.prepend(messageKey($(this).data('content')));
        $(this).removeAttr('data-content');
    });
    $('[data-placeholder]').each(function () {
        $(this).attr('placeholder', messageKey($(this).data('placeholder')));
        $(this).removeAttr('data-placeholder');
    });
}
function calcKeyChecksum(custId, mobileNumber, otp, currentDt) {
    var beforeSign = "";
    beforeSign += custId;
    beforeSign += '#' + mobileNumber;
    beforeSign += '#' + otp;
    beforeSign += '#' + currentDt;
    return CryptoJS.SHA256(beforeSign).toString();
}
function _sendSafetyPass(){
    runAsync(function () {
        $.mobile.loading("show");
        _sendSafetyPasswordSoap(CryptoJS.SHA256($("#safepassval").val()).toString(), $('#internetBankingId').val(), function(safetyRes){
            $.mobile.loading("hide");
            db.transaction(function(tx) {
                updateSafetyPass(safetyRes.encryptedPassword,tx);
            });
            $("#safety-registration-inputs").fadeOut("slow",function(){
                $("#reg-li").hide();
                $("#generate-li").show();
            });
        });
    });
}
function _logMeIn(enteredPass){
    db.transaction(function(tx) {
        inAppLogin(enteredPass,tx);
    });
}
function _confirmRegisterMe(){
    $.mobile.loading("show");
    _confirmRegister($('#customerId').val(), $('#internetBankingId').val(),$('#registeredPhoneNo').val(),function(loginRes){
        if (loginRes.status != '00') {
            $('#register-error').html("کاربری با این اطلاعات وجود ندارد. اطلاعات خود را با دقت وارد نمایید.");
            $('#register-error').show();
            //$('#customerId').val('');
            //$('#internetBankingId').val('');
            //$('#registeredPhoneNo').val('');
            $.mobile.loading("hide");
        }
        else {
            $('#register-error').html('');
            $('#register-error').hide();
            encryptOtp = loginRes.encryptOtp;
            //if(loginRes.otpSafetyPassword==null){
            //}else{
            //    _storeSafetyPass(loginRes.otpSafetyPassword);
            //    $("#hidden-safepass").val(loginRes.otpSafetyPassword);
            //}

            registrationNo = loginRes.registrationNo;
            userId = $('#internetBankingId').val();
            currentDate = loginRes.currentDate;
            customerId = $('#customerId').val();
            mobileNo = $('#registeredPhoneNo').val();
            key = calcKeyChecksum(customerId, mobileNo, encryptOtp, currentDate);
            //syncAccounts();
            db.transaction(function(tx){
                selectKeyData(encryptOtp,registrationNo,userId,currentDate,customerId,mobileNo,key,tx);
            }, errorCB);
            $("#regno-container").html(registrationNo);
            //$('#customerId').val('');
            //$('#internetBankingId').val('');
            //$('#registeredPhoneNo').val('');
            $.mobile.loading("hide");
            $("#sms-inputs").fadeOut("slow",function(){
                $("#sms-error").hide("slow");
                $("#safety-registration-inputs").show();
            });
            //$("#reg-li").hide();
        }
    });
}
function _registerMe() {
    /*if (!$('#un').val()) {
     $('.login-error').html(messageKey('usernameIsNull'));
     return;
     }
     if (!$('#pw').val()) {
     $('.login-error').html(messageKey('passwordIsNull'));
     return;
     }*/

    runAsync(function () {
        $.mobile.loading("show");
        _register($('#customerId').val(), $('#internetBankingId').val(),$('#registeredPhoneNo').val(),function(loginRes){
            if (loginRes.status != '00') {
                $('#register-error').html("کاربری با این اطلاعات وجود ندارد. اطلاعات خود را با دقت وارد نمایید.");
                $('#register-error').show();
                //$('#customerId').val('');
                //$('#internetBankingId').val('');
                //$('#registeredPhoneNo').val('');
                $.mobile.loading("hide");
            }
            else {
                $('#register-error').html('');
                $('#register-error').hide();
                //encryptOtp = loginRes.encryptOtp;
                //if(loginRes.otpSafetyPassword==null){
                $("#registration-inputs").fadeOut("slow",function(){
                    $("#sms-inputs").show();
                });
                encryptOtp = loginRes.encryptOtp;
                userId = $('#internetBankingId').val();
                currentDate = loginRes.currentDate;
                customerId = $('#customerId').val();
                mobileNo = $('#registeredPhoneNo').val();
                db.transaction(function(tx){
                    selectKeyData(encryptOtp,"N/A",userId,currentDate,customerId,mobileNo,"N/A",tx);
                }, errorCB);
                $.mobile.loading("hide");
            }
        });
    });


}
function _storeSafetyPass(safetyPass){
    db.transaction(function(tx){
        storeSafetyPass(safetyPass,tx);
    }, errorCB);
}
function _generateOtp(){
    db.transaction(getENCKeyById,errorCB,successCB);

}
function _sendConfirmation(){
    var simpleKey = $("#sentSms").val();
    db.transaction(getKeyById,errorCB,successCB);
    db.transaction(updateDataForSMSEnter,errorCB,successCB);


}
function _confirmSafetyPass(){
    var safePass = $("#safepass").val();
    db.transaction(function(tx){
        confirmSafetyPass(safePass,tx);
    }, errorCB);
}
var checkForSessionTimeout=function(){
    if(lastActivity<new Date().getTime()-600000)
        logout();
    else
        setTimeout(checkForSessionTimeout,1000);
};

function runAsync(v) {
    v();
//    setTimeout(v, 50);
}
function runWithLoading(v, msg, callback) {
    if (msg) {
        $.mobile.loading('show', {text: msg, textVisible: true});
    }
    else {
        $.mobile.loading('show');
    }
    setTimeout(function(){
        $.mobile.loading('hide');
    },4200);
    //setTimeout(function () {
    v();
    //$.mobile.loading('hide');
    //if (callback)
    //    callback();
    //}, 100);
}