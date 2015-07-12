function createDb(){
	var db = window.openDatabase("otpdb", "1.0", "OTP Database", 1000000);
    db.transaction(populateDB, errorCB, successCreateDB);
	return db;
}
function updateDataForSMSEnter(tx){
    tx.executeSql("UPDATE registration SET SMSENTERED = 'YES'  where id=1");
}

function selectAll(tx){
    tx.executeSql("SELECT * FROM registration", [], selectAllSuccess, errorInitializationCB);
}

function selectAllSuccess(tx, results){

    if(results.rows.length==0){
        db.transaction(createTable,errorCB,successCB);
    }
    db.transaction(getRegistrationNoById,errorCB,successCB);

}
function inAppLogin(safetyPass, tx){
    tx.executeSql("SELECT * FROM registration WHERE ID = 1",[],function(tx,results){
        if(results.rows.length==0){
            $("#incomplete-reg").fadeIn("slow");
        }else{
            for(var i=0; i<results.rows.length; i++) {
                var dbPass = results.rows.item(i).SAFETYPASS;
                if(dbPass=="N/A"){
                    $("#incomplete-reg").fadeIn("slow");
                }else{
                    if(dbPass.toLowerCase() == safetyPass){
                        $("#incomplete-reg").hide();
                        $("#login-inputs").hide();
                        db.transaction(getSMSEnteredById, errorCB,successCB);
                    }else{
                        $("#incomplete-reg").hide();
                        $("#invalid-login").fadeIn("slow");
                    }
                }
            }
        }

    });
}
function getKeyById(tx){
    tx.executeSql("SELECT * FROM registration WHERE ID = 1",[], getKeyByIdSuccess,errorCB);
}
function getKeyByIdSuccess(tx,results){
    for(var i=0; i<results.rows.length; i++) {
        var dbKey = results.rows.item(i).OTP;
        $("#dbSms").val(dbKey);
        var enteredKey = $("#sentSms").val();
        enteredKey = CryptoJS.SHA256(enteredKey).toString();
        if(enteredKey == dbKey){
            $("#sms-error").fadeOut("slow");
            $("#generate-li").show();
            $("#reg-li").hide();
        }else{
            $("#sms-error").fadeIn("slow");
            $("#generate-li").hide();
            $("#reg-li").show();
        }
    }
}
function getENCKeyById(tx){
    tx.executeSql("SELECT * FROM registration WHERE ID = 1",[], getENCKeyByIdSuccess,errorCB);
}
function getENCKeyByIdSuccess(tx,results){
    for(var i=0; i<results.rows.length; i++) {
        var dbEncKey = results.rows.item(i).ENCKEY;
        dbEncKey = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(dbEncKey));
        var seed = $("#seed").val();
//        dbEncKey = toBinString(getByteArray(dbEncKey));
        var genedOtp = genOtp(dbEncKey, seed, 6, true);
        $("#generated-otp").html(genedOtp);
        $("#gen-otp-container").show();

    }
}

function getSMSEnteredById(tx){
    tx.executeSql("SELECT * FROM registration WHERE ID = 1",[], getSMSEnteredByIdSuccess,errorCB);
}
function getSMSEnteredByIdSuccess(tx,results){
    if(results.rows.length==0){
        $("#registration-inputs").show();
        $("#sms-inputs").hide();
    }
    for(var i=0; i<results.rows.length; i++) {
        //FIXME:: move this logic to after login
        var smsIsEntered = results.rows.item(i).SMSENTERED;
        if(smsIsEntered == "NO"){
            $("#generate-li").hide();
            $("#reg-li").show();
            $("#registration-inputs").hide();
            $("#sms-inputs").show();
        }else{
            $("#generate-li").show();
            $("#reg-li").hide();
        }
    }
}
function getRegistrationNoById(tx){
    tx.executeSql("SELECT * FROM registration WHERE ID = 1",[],getRegistrationNoByIdSuccess,errorCB);
}

function getRegistrationNoByIdSuccess(tx,results){
    if(results.rows.length==0){
        $("#regno-container").html("شما تا کنون ثبت نام ننموده اید.")
    }
    for(var i=0; i<results.rows.length; i++) {
        $("#regno-container").html(results.rows.item(i).REGNO);
    }
}
function selectKeyData(encryptOtp, registrationNo, userId, currentDate, customerId, mobileNo, key , tx){
    tx.executeSql("SELECT * FROM registration", [], function(tx,results){
        selectKeyDataSuccess(encryptOtp, registrationNo, userId, currentDate, customerId, mobileNo, key, tx, results);
    }, errorCB);
}
function storeSafetyPass(safetyPass, tx){
    tx.executeSql("UPDATE registration SET SAFETYPASS = '"+safetyPass+"'  where id=1");
    //tx.executeSql("UPDATE registration SET SAFETYPASS = ?  where id=1",[safetyPass],function(){
    $("#hidden-safepass").val(safetyPass);
    $("#safepass-needed").html("در ادامه پیامکی حاوی کد امنیتی برای اتمام ثبت نام دریافت می کنید. برای ادامه، ابتدا گذرواژه ای که در مرحله قبل وارد نمودید را در قسمت زیر وارد نمایید و دکمه ادامه را بفشارید.");
    $("#registration-inputs").fadeOut("slow",function(){
        $("#safety-registration-inputs").show();
    });
    //},errorCB);
}
function updateSafetyPass(safetyPass, tx){
    tx.executeSql("UPDATE registration SET SAFETYPASS = '"+safetyPass+"'  where id=1");
}
function updateRegistrationNo(reqNo, otp, tx){
    tx.executeSql("UPDATE registration SET REGNO = '"+reqNo+"' where id = 1");
    tx.executeSql("UPDATE registration SET OTP = '"+otp+"' where id = 1");
}

function getSafetyPass(tx){
    tx.executeSql("SELECT * FROM registration WHERE ID = 1",[],function(tx,results){
        if(results.rows.length==0){
            $("#login-inputs").hide();
            $("#registration-inputs").show();
            $("#reg-li").show();
        }else{
            for(var i=0; i<results.rows.length; i++) {
                var dbPass = results.rows.item(i).SAFETYPASS;
                if(dbPass=="N/A"){
                    $("#login-inputs").hide();
                    $("#registration-inputs").show();
                    $("#reg-li").show();
                }else{
                    $("#login-inputs").show();
                    $("#registration-inputs").hide();
                    $("#reg-li").hide();
                }
            }
        }
        $("#main").show();
    },errorCB);
}
function confirmSafetyPass(safetyPass, tx){
    var actualPass = $("#hidden-safepass").val();
    tx.executeSql("SELECT * FROM registration WHERE ID = 1",[],function(tx,results){
        var passMatch = false;
        if(results.rows.length==0){
        }else{
            for(var i=0; i<results.rows.length; i++) {
                var dbRegNo = results.rows.item(i).REGNO;
                var dbPass = results.rows.item(i).SAFETYPASS;
                if(dbPass == "N/A"){
                    if(actualPass==safetyPass){
                        $("#safepass-error").hide();
                        $("#register-success").html("با موفقیت ثبت نام نمودید.  کد امنیتی موجود در پیامکی که به زودی دریافت می نمایید را در قسمت زیر وارد نمایید.");
                        $("#safepass-input").fadeOut("slow",function(){
                            $("#sms-inputs").show();
                        });
                    }else{
                        $("#safepass-error").fadeIn("slow");
                    }
                }else{
                    if(dbPass==safetyPass){
                        $("#safepass-error").hide();
                        $("#register-success").html("با موفقیت ثبت نام نمودید.  کد امنیتی موجود در پیامکی که به زودی دریافت می نمایید را در قسمت زیر وارد نمایید.");
                        $("#safepass-input").fadeOut("slow",function(){
                            $("#sms-inputs").show();
                        });
                    }else{
                        $("#safepass-error").fadeIn("slow");
                    }
                }

            }
        }
    },errorCB);
}
function getSafetyPassByIdSuccess(tx,results){

}
function selectKeyDataSuccess(encryptOtp, registrationNo, userId, currentDate, customerId, mobileNo, key, tx ,results){
    if(results.rows.length==0){
        db.transaction(function(tx){
            insertKeyData(customerId,userId,mobileNo, encryptOtp, key, registrationNo, tx);
        },errorCB,function(tx){
            updateRegistrationNo(registrationNo,encryptOtp,tx);

        });
    }else{
        updateRegistrationNo(registrationNo,encryptOtp,tx);
        alert("This is the key: "+encryptOtp);
    }
}
//function insertKeyData(encryptOtp , registrationNo, userId, customerId, mobileNo, key, tx){
//
//}
function createTable(tx){
    tx.executeSql('DROP TABLE IF EXISTS registration',[],function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS registration (ID unique, CUSTID VARCHAR, LOGINID VARCHAR, MOBNO VARCHAR, OTP VARCHAR, ENCKEY VARCHAR, REGNO VARCHAR,SMSENTERED VARCHAR, SAFETYPASS VARCHAR)');
    },errorCB);
}
function insertKeyData(customerId, userId, mobileNo, encryptOtp, key, registrationNo,tx){
    tx.executeSql("INSERT INTO registration values (?,?,?,?,?,?,?,?,?)",
        [1,customerId, userId, mobileNo, encryptOtp, key, registrationNo, "NO","N/A"],insertDataSuccess,errorCB);
}

function insertDataSuccess(){
}
function populateDB(tx){
    db.transaction(selectAll, errorInitializationCB);
}
function errorInitializationCB(err){
    db.transaction(createTable,errorCB,successCB);
    //$("#reg-li").show();
    $("#generate-li").hide();
}
function errorCB(err) {
    alert("Error processing in SQL: "+err.message);
}
function successCB() {
}
function successCreateDB() {
    db.transaction(function(tx){
        getSafetyPass(tx);
    }, errorCB);
}

function parseHexString(str) {
    var result = [];
    while (str.length >= 8) {
        result.push(parseInt(str.substring(0, 8), 16));

        str = str.substring(8, str.length);
    }

    return result;
}

function createHexString(arr) {
    var result = "";
    var z;

    for (var i = 0; i < arr.length; i++) {
        var str = arr[i].toString(16);

        z = 8 - str.length + 1;
        str = Array(z).join("0") + str;

        result += str;
    }

    return result;
}
function getByteArray(str){
    var bytes = [];
    for (var i = 0; i < str.length; ++i) {
        bytes.push(str.charCodeAt(i));
    }
    return bytes;

}
function genOtp(strHex, time, codeDigits, addChecksum){
    var DIGITS_POWER = [ 1, 10, 100, 1000, 10000,
        100000, 1000000, 10000000, 100000000 ];
    var result = null;
    while (time.length < 16){
        time = "0" + time;
    }
    //FIXME
    var timeArray = CryptoJS.enc.Hex.parse(time);
    var hexArray = CryptoJS.enc.Hex.parse(strHex);
    var hash = null;
    var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, hexArray);
    var result = CryptoJS.enc.Base64.stringify(hmacHasher.finalize(timeArray));
    hash = getByteArray(result.trim());
    var offset = hash[hash.length - 1] & 0xF;
    var binary = ((hash[offset] & 0x7F) << 24)
        | ((hash[offset + 1] & 0xFF) << 16)
        | ((hash[offset + 2] & 0xFF) << 8) | (hash[offset + 3] & 0xFF);
    var otp = binary % DIGITS_POWER[codeDigits];
    result = otp+"";
    if (addChecksum) {
        otp = (otp * 10) + calcOtpChecksum(otp, codeDigits);
    }
    while (result.length < codeDigits) {
        result = "0" + result;
    }
    return result;
}
function calcOtpChecksum(num, digits){
    var doubleDigits = [ 0, 2, 4, 6, 8, 1, 3, 5, 7, 9 ];
    var doubleDigit = true;
    var total = 0;
    while (0 < digits) {
        digits = digits-1;
        var digit = parseInt(num % 10);
        num = num/10;
        if (doubleDigit) {
            digit = doubleDigits[digit];
        }
        total += digit;
        doubleDigit = !doubleDigit;
    }
    var result = total % 10;
    if (result > 0) {
        result = 10 - result;
    }
    return result;
}

