/**
 * Created by roohi on 4/6/14.
 */
var language = 'en';
var langdata = {
    en: {
        nologinHeader: 'بانک خاورمیانه',
        signin: 'ورود',
        branchesAndAtms: 'لیست شعب',
        contactInfo: 'اطلاعات تماس',
        feedback: 'ارسال نظرات',
        pleasesignin: 'برای استفاده از سامانه لطفا وارد شوید',
        username: 'نام کاربری',
        password: 'کلمه عبور',
        branchcode: 'کد',
        branchname: 'نام',
        city: 'شهر',
        address: 'آدرس',
        phone: 'تلفن',
        fax: 'فکس',
        postalcode: 'کد پستی',
        columnstodisplay: 'ویرایش ستون های قابل نمایش',
        submit: 'تایید',
        feedbackname: 'نام',
        feedbackphone: 'تلفن',
        feedbacktitle: 'موضوع',
        feedbackcontent: 'متن نظر',
        selectaccount: 'لطفا یک حساب انتخاب نمایید',
        accountdetails: 'جزئیات حساب',
        ministatement: '۱۰ تراکنش آخر',
        stopchq: 'مسدودی چک ها',
        chqstat: 'وضعیت چک ها',
        rqchqbook: 'درخواست دسته چک',
        billpayment: 'پرداخت قبوض',
        fundtransfer: 'انتقال وجه داخلی',
        profile: 'پروفایل',
        acctno: 'شماره حساب',
        availbal: 'مانده قابل برداشت',
        ledgerbal: 'مانده کل',
        acctdesc: 'توضیحات',
        date: 'تاریخ',
        desc: 'شرح',
        debit: 'برداشت',
        credit: 'واریز',
        benAcct: 'حساب ذینفع',
        areyousuretran: 'آیا اطمینان دارید؟',
        tranSuccess: 'تراکنش با موفقیت انجام شد',
        close: 'بستن',
        logout: 'خروج',
        billId: 'شناسه قبض',
        payId: 'شناسه پرداخت',
        pay: 'پرداخت',
        chqbookrqSuccess: 'درخواست دسته چک با موفقیت ثبت شد',
        leaveno: 'تعداد برگ ها',
        remainbal: 'مانده حساب',
        pleaseEnterBillId: 'لطفا شناسه قبض را وارد کنید',
        pleaseEnterPayId: 'لطفا شناسه پرداخت را وارد کنید',
        pleaseSelectLeaveno: 'لطفا تعداد برگ های دسته چک را انتخاب نمایید',
        pleaseSelectBenAccount: 'لطفا حساب را انتخاب نمایید',
        pleaseEnterAmount: 'لطفا مبلغ را وارد نمایید',
        pleaseEnterValidAmount: 'لطفا مبلغ را صحیح وارد نمایید',
        refresh: 'به روز رسانی',
        reporttime: 'زمان به روز رسانی',
        chqNo: 'شماره چک',
        branchinfo: 'اطاعات شعبه',
        status: 'وضعیت',
        amount: 'مبلغ',
        trpwd: 'رمز تراکنش',
        pleaseTranPWD: 'لطفا رمز تراکنش را وارد کنید',
        scan: 'خواندن بارکد',
        transfer: 'انتقال',
        paidStatus: 'وضعیت پرداخت',
        company: 'نوع قبض',
        usernameIsNull: 'نام کاربری خالی است',
        passwordIsNull: 'کلمه عبور خالی است',
        billSuccess: 'پرداخت قبض با موفقیت انجام شد',
        'company.not.found': 'این نوع قبض در سامانه تعریف نشده',
        areYouSureTransfer: 'آیا از انتقال {0} ریال به حساب {1} اطمینان دارید؟',
        01: 'شناسه قبض نامعتبر است',
        23: 'شناسه کاربر یا رمز عبور نامعتبر است',
        25: 'مشخصات کاربر یافت نشد',
        32: 'تراکنش مالی قابل انجام نمی باشد، عملیات پایان روز کاری',
        33: 'تراکنش مالی قابل انجام نمی باشد، عملیات شروع روز کاری',
        34: 'فقط حساب های جاری و کوتاه مدت پذیرفته می شوند',
        47: 'مبلغ تراکنش باید بزرگتر از صفر باشد',
        50: 'ارتباط با سرور مدیریت کانال مقدور نمی باشد',
        55: 'مهلت به پایان رسیده است',
        56: 'صفحه یافت نشد',
        57: 'امکان بارگزاری صفحه وجود ندارد',
        58: 'خطا درتایید اعتبار',
        59: 'شناسه کاربری نمی تواند خالی باشد',
        60: 'شناسه نمی تواند خالی باشد',
        61: 'خطا',
        62: 'زمان سیستم شما نامعتبر است',
        65: 'خطا در دریافت اطلاعات شماره حساب',
        66: 'خطا در به روزرسانی اطلاعات',
        67: 'رمز تراکنش مورد تایید نمی باشد',
        68: 'قبض قبلا پرداخت شده است',
        69: 'موجودی کافی نیست',
        70: 'حساب بسته است',
        71: 'لطفا نوع ارز اصلی حساب را مشخص کنید',
        72: 'حساب مسدود است',
        73: 'قادر به انجام تراکنش نمی باشد',
        100: 'هیچ سابقه ای یافت نشد',
        150: 'لطفا ابتدا با اینترنت بانک ثبت نمایید',
        151: 'لطفا ابتدا با اینترنت بانک ثبت نمایید',
        152: 'رمز تراکنش صحیح نمی باشد',
        153: 'رمز تراکنش تعریف نشده است',
        501: 'دسترسی ممنوع',
        sts_accepted:'با موفقیت ثبت شد',
        contactinfo: '<div class="M-Right"><strong><h1 style="margin-top:15px">دفتر مرکزی</h1></strong><div><div>تلفن:&nbsp;4217&nbsp;8000</div><div>فکس:&nbsp;8870&nbsp;1095</div><div>آدرس:&nbsp;تهران، خیابان احمد قصیر (بخارست)، نبش خیابان پنجم، پلاک 2</div><div>کد پستی:&nbsp;15136 45717</div><div>ایمیل: info@middleeastbank.ir</div></div></div>'
    }
}
function messageKey(key, args,defaultVal) {

    if (!langdata[language])
        language = 'en';
    if (langdata[language][key]) {
        var res = langdata[language][key];
        if (args && args.length) {
            for (var a in args) {
                res = res.replace('{' + a + '}', args[a]);
            }
        }
        return res;
    }
    if(defaultVal)
        return defaultVal;
    return key;
}
