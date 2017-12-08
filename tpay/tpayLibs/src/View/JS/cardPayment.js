jQuery(function ($) {
    !function () {
        var $, cardFromNumber, cardFromType, cards, defaultFormat, formatBackCardNumber, formatBackDateDDMMYYYY, formatBackDateYYYYMMDD, formatBackExpiry, formatBackOntarioDriversLicenseNumber, formatBackOntarioOutdoorsCardNumber, formatBackOntarioPhotoHealthCardNumber, formatBackPhoneNumber, formatBackPostalCode, formatBackTimeYYMM, formatBackUkSortCode, formatCardNumber, formatDateDDMMYYYY, formatDateYYYYMMDD, formatExpiry, formatForwardDateDDMMYYYY, formatForwardDateYYYYMMDD, formatForwardExpiry, formatForwardSlashDateDDMMYYYY, formatForwardSlashDateYYYYMMDD, formatForwardSlashExpiry, formatForwardSlashTimeYYMM, formatForwardTimeYYMM, formatForwardUkSortCode, formatOntarioDriversLicenseNumber, formatOntarioOutdoorsCardNumber, formatOntarioPhotoHealthCardNumber, formatPasteOntarioDriversLicenseNumber, formatPasteOntarioOutdoorsCardNumber, formatPasteOntarioPhotoHealthCardNumber, formatPastePhoneNumber, formatPastePostalCode, formatPhoneNumber, formatPostalCode, formatTimeYYMM, formatUkSortCode, hasTextSelected, luhnCheck, parseCreditCardExpiry, parseDateDDMMYYYY, parseTimeYYMM, parse_date_yyyy_mm_dd, reFormatCardNumber, reFormatPhoneNumber, restrictAlphaNumeric, restrictCVC, restrictCardNumber, restrictDateDDMMYYYY, restrictDateYYYYMMDD, restrictExpiry, restrictNumeric, restrictOntarioDriversLicenseNumber, restrictOntarioOutdoorsCardNumber, restrictOntarioPhotoHealthCardNumber, restrictPhoneNumber, restrictPostalCode, restrictTimeYYMM, restrictUkSortCode, setCardType, __slice = [].slice, __indexOf = [].indexOf || function (item) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (i in this && this[i] === item)return i
                }
                return -1
            };
        $ = jQuery;
        $.formance = {};
        $.formance.fn = {};
        $.fn.formance = function () {
            var args, method;
            method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            return $.formance.fn[method].apply(this, args)
        };
        restrictNumeric = function (e) {
            var $target, input;
            $target = $(e.target);
            if (e.metaKey || e.ctrlKey) {
                return true
            }
            if (e.which === 32) {
                return false
            }
            if (e.which === 0) {
                return true
            }
            if (e.which < 33) {
                return true
            }
            input = String.fromCharCode(e.which);
            return !!/[\d\s]/.test(input)
        };
        restrictAlphaNumeric = function (e) {
            var $target, input;
            $target = $(e.target);
            if (e.metaKey || e.ctrlKey) {
                return true
            }
            if (e.which === 32) {
                return false
            }
            if (e.which === 0) {
                return true
            }
            if (e.which < 33) {
                return true
            }
            input = String.fromCharCode(e.which);
            return !!/[\d\sA-Za-z]/.test(input)
        };
        hasTextSelected = function ($target) {
            var _ref;
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== $target.prop("selectionEnd")) {
                return true
            }
            if (typeof document !== "undefined" && document !== null ? (_ref = document.selection) != null ? typeof _ref.createRange === "function" ? _ref.createRange().text : void 0 : void 0 : void 0) {
                return true
            }
            return false
        };
        $.formance.fn.restrictNumeric = function () {
            this.on("keypress", restrictNumeric);
            return this
        };
        $.formance.fn.restrictAlphaNumeric = function () {
            this.on("keypress", restrictAlphaNumeric);
            return this
        };
        $.formance.fn.hasTextSelected = hasTextSelected;
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        defaultFormat = /(\d{1,4})/g;
        cards = [{
            type: "maestro",
            pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
            format: defaultFormat,
            length: [12, 13, 14, 15, 16, 17, 18, 19],
            cvcLength: [3],
            luhn: true
        }, {
            type: "dinersclub",
            pattern: /^(36|38|30[0-5])/,
            format: defaultFormat,
            length: [14],
            cvcLength: [3],
            luhn: true
        }, {
            type: "laser",
            pattern: /^(6706|6771|6709)/,
            format: defaultFormat,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: true
        }, {
            type: "jcb",
            pattern: /^35/,
            format: defaultFormat,
            length: [16],
            cvcLength: [3],
            luhn: true
        }, {
            type: "unionpay",
            pattern: /^62/,
            format: defaultFormat,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: false
        }, {
            type: "discover",
            pattern: /^(6011|65|64[4-9]|622)/,
            format: defaultFormat,
            length: [16],
            cvcLength: [3],
            luhn: true
        }, {
            type: "mastercard",
            pattern: /^5[1-5]/,
            format: defaultFormat,
            length: [16],
            cvcLength: [3],
            luhn: true
        }, {
            type: "amex",
            pattern: /^3[47]/,
            format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
            length: [15],
            cvcLength: [3, 4],
            luhn: true
        }, {type: "visa", pattern: /^4/, format: defaultFormat, length: [13, 14, 15, 16], cvcLength: [3], luhn: true}];
        cardFromNumber = function (num) {
            var card, _i, _len;
            num = (num + "").replace(/\D/g, "");
            for (_i = 0, _len = cards.length; _i < _len; _i++) {
                card = cards[_i];
                if (card.pattern.test(num)) {
                    return card
                }
            }
        };
        cardFromType = function (type) {
            var card, _i, _len;
            for (_i = 0, _len = cards.length; _i < _len; _i++) {
                card = cards[_i];
                if (card.type === type) {
                    return card
                }
            }
        };
        restrictCVC = function (e) {
            var $target, digit, val;
            $target = $(e.currentTarget);
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            val = $target.val() + digit;
            return val.length <= 4
        };
        $.formance.fn.format_credit_card_cvc = function () {
            this.formance("restrictNumeric");
            this.on("keypress", restrictCVC);
            return this
        };
        $.formance.fn.validate_credit_card_cvc = function () {
            var cvc, type, _ref, _ref1;
            type = $(this).data("credit_card_type");
            cvc = $(this).val();
            cvc = $.trim(cvc);
            if (!/^\d+$/.test(cvc)) {
                return false
            }
            if (type) {
                return _ref = cvc.length, __indexOf.call((_ref1 = cardFromType(type)) != null ? _ref1.cvcLength : void 0, _ref) >= 0
            } else {
                return cvc.length >= 3 && cvc.length <= 4
            }
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        restrictExpiry = function (e) {
            var $target, digit, value;
            $target = $(e.currentTarget);
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = $target.val() + digit;
            value = value.replace(/\D/g, "");
            if (value.length > 6) {
                return false
            }
        };
        formatExpiry = function (e) {
            var $target, digit, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val() + digit;
            if (/^\d$/.test(val) && val !== "0" && val !== "1") {
                e.preventDefault();
                return $target.val("0" + val + " / ")
            } else if (/^\d\d$/.test(val)) {
                e.preventDefault();
                return $target.val("" + val + " / ")
            }
        };
        formatForwardExpiry = function (e) {
            var $target, digit, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val();
            if (/^\d\d$/.test(val)) {
                return $target.val("" + val + " / ")
            }
        };
        formatForwardSlashExpiry = function (e) {
            var $target, slash, val;
            slash = String.fromCharCode(e.which);
            if (slash !== "/") {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val();
            if (/^\d$/.test(val) && val !== "0") {
                return $target.val("0" + val + " / ")
            }
        };
        formatBackExpiry = function (e) {
            var $target, value;
            if (e.meta) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/\d(\s|\/)+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\d(\s|\/)*$/, ""))
            } else if (/\s\/\s?\d?$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\s\/\s?\d?$/, ""))
            }
        };
        $.formance.fn.format_credit_card_expiry = function () {
            this.formance("restrictNumeric");
            this.on("keypress", restrictExpiry);
            this.on("keypress", formatExpiry);
            this.on("keypress", formatForwardSlashExpiry);
            this.on("keypress", formatForwardExpiry);
            this.on("keydown", formatBackExpiry);
            return this
        };
        parseCreditCardExpiry = function (expiry_string) {
            var month, prefix, val, year, _ref;
            val = expiry_string.replace(/\s/g, "");
            _ref = val.split("/", 2), month = _ref[0], year = _ref[1];
            if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
                prefix = (new Date).getFullYear();
                prefix = prefix.toString().slice(0, 2);
                year = prefix + year
            }
            month = parseInt(month, 10);
            year = parseInt(year, 10);
            return {month: month, year: year}
        };
        $.formance.fn.val_credit_card_expiry = function () {
            var expiry;
            expiry = parseCreditCardExpiry(this.val());
            if (expiry.month == null || isNaN(expiry.month)) {
                return false
            }
            if (expiry.year == null || isNaN(expiry.year)) {
                return false
            }
            return new Date(expiry.year, expiry.month - 1)
        };
        $.formance.fn.validate_credit_card_expiry = function () {
            var currentTime, expiry, expiry_date, month, prefix, year, _ref;
            expiry_date = parseCreditCardExpiry(this.val());
            month = expiry_date.month;
            year = expiry_date.year;
            if (typeof month === "object" && "month" in month) {
                _ref = month, month = _ref.month, year = _ref.year
            }
            if (!(month && year)) {
                return false
            }
            month = $.trim(month);
            year = $.trim(year);
            if (!/^\d+$/.test(month)) {
                return false
            }
            if (!/^\d+$/.test(year)) {
                return false
            }
            if (!(parseInt(month, 10) <= 12)) {
                return false
            }
            if (year.length === 2) {
                prefix = (new Date).getFullYear();
                prefix = prefix.toString().slice(0, 2);
                year = prefix + year
            }
            expiry = new Date(year, month);
            currentTime = new Date;
            expiry.setMonth(expiry.getMonth() - 1);
            expiry.setMonth(expiry.getMonth() + 1, 1);
            return expiry > currentTime
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        defaultFormat = /(\d{1,4})/g;
        cards = [{
            type: "maestro",
            pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
            format: defaultFormat,
            length: [12, 13, 14, 15, 16, 17, 18, 19],
            cvcLength: [3],
            luhn: true
        }, {
            type: "dinersclub",
            pattern: /^(36|38|30[0-5])/,
            format: defaultFormat,
            length: [14],
            cvcLength: [3],
            luhn: true
        }, {
            type: "laser",
            pattern: /^(6706|6771|6709)/,
            format: defaultFormat,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: true
        }, {
            type: "jcb",
            pattern: /^35/,
            format: defaultFormat,
            length: [16],
            cvcLength: [3],
            luhn: true
        }, {
            type: "unionpay",
            pattern: /^62/,
            format: defaultFormat,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: false
        }, {
            type: "discover",
            pattern: /^(6011|65|64[4-9]|622)/,
            format: defaultFormat,
            length: [16],
            cvcLength: [3],
            luhn: true
        }, {
            type: "mastercard",
            pattern: /^5[1-5]/,
            format: defaultFormat,
            length: [16],
            cvcLength: [3],
            luhn: true
        }, {
            type: "amex",
            pattern: /^3[47]/,
            format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
            length: [15],
            cvcLength: [3, 4],
            luhn: true
        }, {type: "visa", pattern: /^4/, format: defaultFormat, length: [13, 14, 15, 16], cvcLength: [3], luhn: true}];
        cardFromNumber = function (num) {
            var card, _i, _len;
            num = (num + "").replace(/\D/g, "");
            for (_i = 0, _len = cards.length; _i < _len; _i++) {
                card = cards[_i];
                if (card.pattern.test(num)) {
                    return card
                }
            }
        };
        cardFromType = function (type) {
            var card, _i, _len;
            for (_i = 0, _len = cards.length; _i < _len; _i++) {
                card = cards[_i];
                if (card.type === type) {
                    return card
                }
            }
        };
        luhnCheck = function (num) {
            var digit, digits, odd, sum, _i, _len;
            odd = true;
            sum = 0;
            digits = (num + "").split("").reverse();
            for (_i = 0, _len = digits.length; _i < _len; _i++) {
                digit = digits[_i];
                digit = parseInt(digit, 10);
                if (odd = !odd) {
                    digit *= 2
                }
                if (digit > 9) {
                    digit -= 9
                }
                sum += digit
            }
            return sum % 10 === 0
        };
        restrictCardNumber = function (e) {
            var $target, card, digit, value;
            $target = $(e.currentTarget);
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = ($target.val() + digit).replace(/\D/g, "");
            card = cardFromNumber(value);
            if (card) {
                return value.length <= card.length[card.length.length - 1]
            } else {
                return value.length <= 16
            }
        };
        reFormatCardNumber = function (e) {
            var _this = this;
            return setTimeout(function () {
                var $target, value;
                $target = $(e.currentTarget);
                value = $target.val();
                value = $.formance.formatCardNumber(value);
                return $target.val(value)
            })
        };
        formatCardNumber = function (e) {
            var $target, card, digit, length, re, upperLength, value;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            card = cardFromNumber(value + digit);
            length = (value.replace(/\D/g, "") + digit).length;
            upperLength = 16;
            if (card) {
                upperLength = card.length[card.length.length - 1]
            }
            if (length >= upperLength) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (card && card.type === "amex") {
                re = /^(\d{4}|\d{4}\s\d{6})$/
            } else {
                re = /(?:^|\s)(\d{4})$/
            }
            if (re.test(value)) {
                e.preventDefault();
                return $target.val(value + " " + digit)
            } else if (re.test(value + digit)) {
                e.preventDefault();
                return $target.val(value + digit + " ")
            }
        };
        formatBackCardNumber = function (e) {
            var $target, value;
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.meta) {
                return
            }
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/\d\s$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\d\s$/, ""))
            } else if (/\s\d?$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\s\d?$/, ""))
            }
        };
        setCardType = function (e) {
            var $target, allTypes, card, cardType, val;
            $target = $(e.currentTarget);
            val = $target.val();
            cardType = $.formance.creditCardType(val) || "unknown";
            if (!$target.hasClass(cardType)) {
                allTypes = function () {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = cards.length; _i < _len; _i++) {
                        card = cards[_i];
                        _results.push(card.type)
                    }
                    return _results
                }();
                $target.removeClass("unknown");
                $target.removeClass(allTypes.join(" "));
                $target.addClass(cardType);
                $target.toggleClass("identified", cardType !== "unknown");
                return $target.trigger("payment.cardType", cardType)
            }
        };
        $.formance.creditCardType = function (num) {
            var _ref;
            if (!num) {
                return null
            }
            return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null
        };
        $.formance.formatCreditCardNumber = function (num) {
            var card, groups, upperLength, _ref;
            card = cardFromNumber(num);
            if (!card) {
                return num
            }
            upperLength = card.length[card.length.length - 1];
            num = num.replace(/\D/g, "");
            num = num.slice(0, +upperLength + 1 || 9e9);
            if (card.format.global) {
                return (_ref = num.match(card.format)) != null ? _ref.join(" ") : void 0
            } else {
                groups = card.format.exec(num);
                if (groups != null) {
                    groups.shift()
                }
                return groups != null ? groups.join(" ") : void 0
            }
        };
        $.formance.fn.format_credit_card_number = function () {
            this.formance("restrictNumeric");
            this.on("keypress", restrictCardNumber);
            this.on("keypress", formatCardNumber);
            this.on("keydown", formatBackCardNumber);
            this.on("keyup", setCardType);
            this.on("paste", reFormatCardNumber);
            return this
        };
        $.formance.fn.validate_credit_card_number = function () {
            var card, num, _ref;
            num = $(this).val();
            num = (num + "").replace(/\s+|-/g, "");
            if (!/^\d+$/.test(num)) {
                return false
            }
            card = cardFromNumber(num);
            if (!card) {
                return false
            }
            return (_ref = num.length, __indexOf.call(card.length, _ref) >= 0) && (card.luhn === false || luhnCheck(num))
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        restrictDateDDMMYYYY = function (e) {
            var $target, digit, value;
            $target = $(e.currentTarget);
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = $target.val() + digit;
            value = value.replace(/\D/g, "");
            if (value.length > 8) {
                return false
            }
        };
        formatDateDDMMYYYY = function (e) {
            var $target, digit, old_val, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            old_val = $target.val();
            val = old_val + digit;
            if (/^\d$/.test(val) && digit !== "0" && digit !== "1" && digit !== "2" && digit !== "3") {
                e.preventDefault();
                return $target.val("0" + val + " / ")
            } else if (/^\d{2}$/.test(val)) {
                e.preventDefault();
                return $target.val("" + val + " / ")
            } else if (/^\d{2}\s\/\s\d$/.test(val) && digit !== "0" && digit !== "1") {
                e.preventDefault();
                return $target.val("" + old_val + "0" + digit + " / ")
            } else if (/^\d{2}\s\/\s\d{2}$/.test(val)) {
                e.preventDefault();
                return $target.val("" + val + " / ")
            }
        };
        formatForwardDateDDMMYYYY = function (e) {
            var $target, digit, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val();
            if (/^\d{2}$/.test(val) || /^\d{2}\s\/\s\d{2}$/.test(val)) {
                return $target.val("" + val + " / ")
            }
        };
        formatForwardSlashDateDDMMYYYY = function (e) {
            var $target, date, day, month, parse_day, parse_month, slash, val, _ref;
            slash = String.fromCharCode(e.which);
            if (slash !== "/") {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val();
            parse_day = /^(\d)$/;
            parse_month = /^(\d{2})\s\/\s(\d)$/;
            if (parse_day.test(val) && val !== "0") {
                return $target.val("0" + val + " / ")
            } else if (parse_month.test(val)) {
                _ref = val.match(parse_month), date = _ref[0], day = _ref[1], month = _ref[2];
                if (month !== "0") {
                    return $target.val("" + day + " / 0" + month + " / ")
                }
            }
        };
        formatBackDateDDMMYYYY = function (e) {
            var $target, value;
            if (e.meta) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/\d(\s|\/)+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\d(\s|\/)*$/, ""))
            } else if (/\s\/\s?\d?$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\s\/\s?\d?$/, ""))
            }
        };
        $.formance.fn.format_dd_mm_yyyy = function () {
            this.formance("restrictNumeric");
            this.on("keypress", restrictDateDDMMYYYY);
            this.on("keypress", formatDateDDMMYYYY);
            this.on("keypress", formatForwardSlashDateDDMMYYYY);
            this.on("keypress", formatForwardDateDDMMYYYY);
            this.on("keydown", formatBackDateDDMMYYYY);
            return this
        };
        parseDateDDMMYYYY = function (date_string) {
            var day, month, year, _ref;
            _ref = date_string != null ? date_string.replace(/\s/g, "").split("/", 3) : [NaN, NaN, NaN], day = _ref[0], month = _ref[1], year = _ref[2];
            if (!(year != null && year.length === 4)) {
                year = NaN
            }
            day = parseInt(day, 10);
            month = parseInt(month, 10);
            year = parseInt(year, 10);
            return {day: day, month: month, year: year}
        };
        $.formance.fn.val_dd_mm_yyyy = function () {
            var date;
            date = parseDateDDMMYYYY(this.val());
            if (date.day == null || isNaN(date.day)) {
                return false
            }
            if (date.month == null || isNaN(date.month)) {
                return false
            }
            if (date.year == null || isNaN(date.year)) {
                return false
            }
            return new Date(date.year, date.month - 1, date.day)
        };
        $.formance.fn.validate_dd_mm_yyyy = function () {
            var date, date_dict;
            date_dict = parseDateDDMMYYYY(this.val());
            date = this.formance("val_dd_mm_yyyy");
            if (!(date != null && date instanceof Date)) {
                return false
            }
            if (date.getDate() !== date_dict.day) {
                return false
            }
            if (date.getMonth() + 1 !== date_dict.month) {
                return false
            }
            if (date.getFullYear() !== date_dict.year) {
                return false
            }
            return true
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        $.formance.fn.format_email = function () {
            return this
        };
        $.formance.fn.validate_email = function () {
            var $this, algorithms, val, validator;
            algorithms = {
                simple: /^\S+@\S+$/,
                complex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\ ".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA -Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            };
            $this = $(this);
            val = $this.val();
            if (val == null) {
                return false
            }
            validator = $this.data("formance_algorithm");
            if (validator != null && validator in algorithms) {
                return algorithms[validator].test(val)
            }
            return algorithms["simple"].test(val)
        };
        $ = jQuery;
        $.formance.fn.format_number = function () {
            var length;
            length = $(this).data("formance_length");
            if (length != null) {
                $(this).attr("maxLength", length)
            }
            this.formance("restrictNumeric");
            return this
        };
        $.formance.fn.validate_number = function () {
            var $this, length, val;
            $this = $(this);
            val = $this.val();
            length = $this.data("formance_length");
            if (length != null && typeof length === "number" && val.length !== length) {
                return false
            }
            if (length != null && typeof length === "string" && length !== "") {
                if (isNaN(parseInt(length, 10))) {
                    return false
                }
                if (val.length !== parseInt(length, 10)) {
                    return false
                }
            }
            return /^\d+$/.test(val)
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        restrictOntarioDriversLicenseNumber = function (e) {
            var $target, char, value;
            $target = $(e.currentTarget);
            char = String.fromCharCode(e.which);
            if (!/^[a-zA-Z\d]+$/.test(char)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = $target.val() + char;
            value = value.replace(/[^a-zA-Z\d]/g, "");
            if (value.length > 15) {
                return false
            }
        };
        formatOntarioDriversLicenseNumber = function (e) {
            var $target, char, old_val, val;
            char = String.fromCharCode(e.which);
            if (!/^[a-zA-Z\d]+$/.test(char)) {
                return
            }
            $target = $(e.currentTarget);
            old_val = $target.val();
            val = old_val + char.toUpperCase();
            if (old_val === "") {
                e.preventDefault();
                if (/^[A-Za-z]$/.test(val)) {
                    return $target.val(val)
                }
            } else if (/^[A-Za-z]\d{0,3}$/.test(old_val)) {
                e.preventDefault();
                if (/^[A-Za-z]\d{4}$/.test(val)) {
                    val = "" + val + " - "
                }
                if (/^[A-Za-z]\d{0,4}[\s|\-]*$/.test(val)) {
                    return $target.val(val)
                }
            } else if (/^[A-Za-z]\d{4}[\s|\-]*\d{0,4}$/.test(old_val)) {
                e.preventDefault();
                if (/^[A-Za-z]\d{4}[\s|\-]*\d{5}$/.test(val)) {
                    val = "" + val + " - "
                }
                if (/^[A-Za-z]\d{4}[\s|\-]*\d{0,5}[\s|\-]*$/.test(val)) {
                    return $target.val(val)
                }
            }
        };
        formatBackOntarioDriversLicenseNumber = function (e) {
            var $target, value;
            if (e.meta) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/\d(\s|\-)+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\d(\s|\-)+$/, ""))
            }
        };
        formatPasteOntarioDriversLicenseNumber = function (e) {
            var _this = this;
            return setTimeout(function () {
                var $target, first5, full, last5, middle5, val, _ref;
                $target = $(e.currentTarget);
                val = $target.val();
                _ref = val.match(/^([A-Za-z\d]{5})[\s|\-]*(\d{5})[\s|\-]*(\d{5})$/), full = _ref[0], first5 = _ref[1], middle5 = _ref[2], last5 = _ref[3];
                return $target.val("" + first5 + " - " + middle5 + " - " + last5)
            })
        };
        $.formance.fn.format_ontario_drivers_license_number = function () {
            this.formance("restrictAlphaNumeric");
            this.on("keypress", restrictOntarioDriversLicenseNumber);
            this.on("keypress", formatOntarioDriversLicenseNumber);
            this.on("keydown", formatBackOntarioDriversLicenseNumber);
            this.on("paste", formatPasteOntarioDriversLicenseNumber);
            return this
        };
        $.formance.fn.validate_ontario_drivers_license_number = function () {
            var regex, val;
            val = $(this).val();
            if (val == null) {
                return false
            }
            val = val.replace(/[\s|\-]/g, "");
            if (!/^[a-zA-Z\d]+$/.test()) {
                return false
            }
            regex = /^[A-Za-z]\d{4}[\s|\-]*\d{5}[\s|\-]*\d{5}$/;
            return regex.test(val)
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        restrictOntarioOutdoorsCardNumber = function (e) {
            var $target, digit, value;
            $target = $(e.currentTarget);
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = $target.val() + digit;
            value = value.replace(/\D/g, "");
            if (value.length > 15) {
                return false
            }
        };
        formatOntarioOutdoorsCardNumber = function (e) {
            var $target, digit, old_val, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            old_val = $target.val();
            val = $target.val() + digit;
            if (old_val === "") {
                e.preventDefault();
                val = /^7$/.test(val) ? "708158 " : "708158 " + val;
                return $target.val(val)
            } else if (/^\d{5}$/.test(old_val)) {
                e.preventDefault();
                if (/^\d{6}$/.test(val)) {
                    val = "" + val + " "
                }
                if (/^\d{6}\s*$/.test(val)) {
                    return target.val(val)
                }
            }
        };
        formatBackOntarioOutdoorsCardNumber = function (e) {
            var $target, value;
            if (e.meta) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/708158\s+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/708158\s+$/, ""))
            }
        };
        formatPasteOntarioOutdoorsCardNumber = function (e) {
            var _this = this;
            return setTimeout(function () {
                var $target, first6, full, last9, val, _ref;
                $target = $(e.currentTarget);
                val = $target.val();
                _ref = val.match(/^(\d{6})\s*(\d{9})$/), full = _ref[0], first6 = _ref[1], last9 = _ref[2];
                return $target.val("" + first6 + " " + last9)
            })
        };
        $.formance.fn.format_ontario_outdoors_card_number = function () {
            this.formance("restrictNumeric");
            this.on("keypress", restrictOntarioOutdoorsCardNumber);
            this.on("keypress", formatOntarioOutdoorsCardNumber);
            this.on("keydown", formatBackOntarioOutdoorsCardNumber);
            this.on("paste", formatPasteOntarioOutdoorsCardNumber);
            return this
        };
        $.formance.fn.validate_ontario_outdoors_card_number = function () {
            var regex, val;
            val = $(this).val();
            if (val == null) {
                return false
            }
            val = val.replace(/\s/g, "");
            if (!/^\d+$/.test(val)) {
                return false
            }
            regex = /^708158\s*\d{9}$/;
            return regex.test(val)
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        restrictOntarioPhotoHealthCardNumber = function (e) {
            var $target, char, value;
            $target = $(e.currentTarget);
            char = String.fromCharCode(e.which);
            if (!/^[a-zA-Z\d]+$/.test(char)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = $target.val() + char;
            value = value.replace(/[^a-zA-Z\d]/g, "");
            if (value.length > 12) {
                return false
            }
        };
        formatOntarioPhotoHealthCardNumber = function (e) {
            var $target, char, old_val, val;
            char = String.fromCharCode(e.which);
            if (!/^[a-zA-Z\d]+$/.test(char)) {
                return
            }
            $target = $(e.currentTarget);
            old_val = $target.val();
            val = old_val + char.toUpperCase();
            if (/^\d{0,3}$/.test(old_val)) {
                e.preventDefault();
                if (/^\d{4}$/.test(val)) {
                    val = "" + val + " - "
                }
                if (/^\d{0,4}[\s|\-]*$/.test(val)) {
                    return $target.val(val)
                }
            } else if (/^\d{4}[\s|\-]*\d{0,2}$/.test(old_val)) {
                e.preventDefault();
                if (/^\d{4}[\s|\-]*\d{3}$/.test(val)) {
                    val = "" + val + " - "
                }
                if (/^\d{4}[\s|\-]*\d{0,3}[\s|\-]*$/.test(val)) {
                    return $target.val(val)
                }
            } else if (/^\d{4}[\s|\-]*\d{3}[\s|\-]*\d{0,2}$/.test(old_val)) {
                e.preventDefault();
                if (/^\d{4}[\s|\-]*\d{3}[\s|\-]*\d{3}$/.test(val)) {
                    val = "" + val + " - "
                }
                if (/^\d{4}[\s|\-]*\d{3}[\s|\-]*\d{0,3}[\s|\-]*$/.test(val)) {
                    return $target.val(val)
                }
            } else if (/^\d{4}[\s|\-]*\d{3}[\s|\-]*\d{3}[\s|\-]*[A-Za-z]{0,1}$/.test(old_val)) {
                e.preventDefault();
                if (/^\d{4}[\s|\-]*\d{3}[\s|\-]*\d{3}[\s|\-]*[A-Za-z]{0,2}$/.test(val)) {
                    return $target.val(val)
                }
            }
        };
        formatBackOntarioPhotoHealthCardNumber = function (e) {
            var $target, value;
            if (e.meta) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/\d(\s|\-)+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\d(\s|\-)+$/, ""))
            }
        };
        formatPasteOntarioPhotoHealthCardNumber = function (e) {
            var _this = this;
            return setTimeout(function () {
                var $target, first4, full, last2, second3, third3, val, _ref;
                $target = $(e.currentTarget);
                val = $target.val();
                _ref = val.match(/^(\d{4})[\s|\-]*(\d{3})[\s|\-]*(\d{3})[\s|\-]*([A-Za-z]{2})$/), full = _ref[0], first4 = _ref[1], second3 = _ref[2], third3 = _ref[3], last2 = _ref[4];
                return $target.val("" + first4 + " - " + second3 + " - " + third3 + " - " + last2)
            })
        };
        $.formance.fn.format_ontario_photo_health_card_number = function () {
            this.formance("restrictAlphaNumeric");
            this.on("keypress", restrictOntarioPhotoHealthCardNumber);
            this.on("keypress", formatOntarioPhotoHealthCardNumber);
            this.on("keydown", formatBackOntarioPhotoHealthCardNumber);
            this.on("paste", formatPasteOntarioPhotoHealthCardNumber);
            return this
        };
        $.formance.fn.validate_ontario_photo_health_card_number = function () {
            var regex, val;
            val = $(this).val();
            if (val == null) {
                return false
            }
            val = val.replace(/[\s|\-]/g, "");
            if (!/^[a-zA-Z\d]+$/.test()) {
                return false
            }
            regex = /^\d{4}[\s|\-]*\d{3}[\s|\-]*\d{3}[\s|\-]*[A-Za-z]{2}$/;
            return regex.test(val)
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        reFormatPhoneNumber = function (phoneNumberString) {
            var areaCode, first3, last4, phoneNumber, text, _ref;
            phoneNumber = phoneNumberString.replace(/\D/g, "").match(/^(\d{0,3})?(\d{0,3})?(\d{0,4})?$/);
            _ref = phoneNumber, phoneNumber = _ref[0], areaCode = _ref[1], first3 = _ref[2], last4 = _ref[3];
            text = "";
            if (areaCode != null) {
                text += "(" + areaCode
            }
            if ((areaCode != null ? areaCode.length : void 0) === 3) {
                text += ") "
            }
            if (first3 != null) {
                text += "" + first3
            }
            if ((first3 != null ? first3.length : void 0) === 3) {
                text += " - "
            }
            if (last4 != null) {
                text += "" + last4
            }
            return text
        };
        restrictPhoneNumber = function (e) {
            var $target, digit, value;
            $target = $(e.currentTarget);
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = $target.val() + digit;
            value = value.replace(/\D/g, "");
            if (value.length > 10) {
                return false
            }
        };
        formatPhoneNumber = function (e) {
            var $target, digit, text, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val() + digit;
            text = reFormatPhoneNumber(val);
            e.preventDefault();
            return $target.val(text)
        };
        formatBackPhoneNumber = function (e) {
            var $target, value;
            if (e.meta) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/\(\d$/.test(value)) {
                e.preventDefault();
                return $target.val("")
            } else if (/\d\)(\s)+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\d\)(\s)*$/, ""))
            } else if (/\d(\s|\-)+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\d(\s|\-)+$/, ""))
            }
        };
        formatPastePhoneNumber = function (e) {
            var _this = this;
            return setTimeout(function () {
                var $target, text, val;
                $target = $(e.currentTarget);
                val = $target.val();
                text = reFormatPhoneNumber(val);
                return $target.val(text)
            })
        };
        $.formance.fn.format_phone_number = function () {
            this.formance("restrictNumeric");
            this.on("keypress", restrictPhoneNumber);
            this.on("keypress", formatPhoneNumber);
            this.on("keydown", formatBackPhoneNumber);
            this.on("paste", formatPastePhoneNumber);
            return this
        };
        $.formance.fn.validate_phone_number = function () {
            var val;
            val = $(this).val();
            if (val == null) {
                return false
            }
            val = val.replace(/\(|\)|\s+|-/g, "");
            if (!/^\d+$/.test(val)) {
                return false
            }
            return val.replace(/\D/g, "").length === 10
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        restrictPostalCode = function (e) {
            var $target, char, value;
            $target = $(e.currentTarget);
            char = String.fromCharCode(e.which);
            if (!/^[a-zA-Z\d]+$/.test(char)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = $target.val() + char;
            value = value.replace(/[^a-zA-Z\d]/g, "");
            if (value.length > 6) {
                return false
            }
        };
        formatPostalCode = function (e) {
            var $target, char, old_val, val;
            char = String.fromCharCode(e.which);
            if (!/^[a-zA-Z\d]+$/.test(char)) {
                return
            }
            $target = $(e.currentTarget);
            old_val = $target.val();
            val = old_val + char.toUpperCase();
            if (old_val === "") {
                e.preventDefault();
                if (/^[ABCEFGHJKLMNPRSTVXY]$/.test(val)) {
                    return $target.val(val)
                }
            } else if (/^[ABCEFGHJKLMNPRSTVXY]$/.test(old_val)) {
                e.preventDefault();
                if (/^[ABCEFGHJKLMNPRSTVXY][0-9]$/.test(val)) {
                    return $target.val(val)
                }
            } else if (/^[ABCEFGHJKLMNPRSTVXY][0-9]$/.test(old_val)) {
                e.preventDefault();
                if (/^[ABCEFGHJKLMNPRSTVXY][0-9][ABCEFGHJKLMNPRSTVWXYZ]$/.test(val)) {
                    return $target.val("" + val + " ")
                }
            } else if (/^[ABCEFGHJKLMNPRSTVXY][0-9][ABCEFGHJKLMNPRSTVWXYZ]\s$/.test(old_val)) {
                e.preventDefault();
                if (/^[ABCEFGHJKLMNPRSTVXY][0-9][ABCEFGHJKLMNPRSTVWXYZ]\s?[0-9]$/.test(val)) {
                    return $target.val(val)
                }
            } else if (/^[ABCEFGHJKLMNPRSTVXY][0-9][ABCEFGHJKLMNPRSTVWXYZ]\s?[0-9]$/.test(old_val)) {
                e.preventDefault();
                if (/^[ABCEFGHJKLMNPRSTVXY][0-9][ABCEFGHJKLMNPRSTVWXYZ]\s?[0-9][ABCEFGHJKLMNPRSTVWXYZ]$/.test(val)) {
                    return $target.val(val)
                }
            } else if (/^[ABCEFGHJKLMNPRSTVXY][0-9][ABCEFGHJKLMNPRSTVWXYZ]\s?[0-9][ABCEFGHJKLMNPRSTVWXYZ]$/.test(old_val)) {
                e.preventDefault();
                if (/^[ABCEFGHJKLMNPRSTVXY][0-9][ABCEFGHJKLMNPRSTVWXYZ]\s?[0-9][ABCEFGHJKLMNPRSTVWXYZ][0-9]$/.test(val)) {
                    return $target.val(val)
                }
            }
        };
        formatBackPostalCode = function (e) {
            var $target, value;
            if (e.meta) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/[ABCEFGHJKLMNPRSTVWXYZ](\s)+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/[ABCEFGHJKLMNPRSTVWXYZ](\s)*$/, ""))
            }
        };
        formatPastePostalCode = function (e) {
            var _this = this;
            return setTimeout(function () {
                var $target, first_part, full, second_part, val, _ref;
                $target = $(e.currentTarget);
                val = $target.val();
                _ref = val.match(/^([ABCEFGHJKLMNPRSTVXY][0-9][ABCEFGHJKLMNPRSTVWXYZ])\s?([0-9][ABCEFGHJKLMNPRSTVWXYZ][0-9])$/), full = _ref[0], first_part = _ref[1], second_part = _ref[2];
                return $target.val("" + first_part + " " + second_part)
            })
        };
        $.formance.fn.format_postal_code = function () {
            this.formance("restrictAlphaNumeric");
            this.on("keypress", restrictPostalCode);
            this.on("keypress", formatPostalCode);
            this.on("keydown", formatBackPostalCode);
            this.on("paste", formatPastePostalCode);
            return this
        };
        $.formance.fn.validate_postal_code = function () {
            var val;
            val = $(this).val();
            if (val == null) {
                return false
            }
            val = val.replace(/\s+/g, "");
            if (!/^[a-zA-Z\d]+$/.test(val)) {
                return false
            }
            val = val.replace(/[^a-zA-Z\d]/g, "");
            return /^[ABCEFGHJKLMNPRSTVXY][0-9][ABCEFGHJKLMNPRSTVWXYZ]\s?[0-9][ABCEFGHJKLMNPRSTVWXYZ][0-9]$/.test(val.toUpperCase())
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        restrictTimeYYMM = function (e) {
            var $target, digit, value;
            $target = $(e.currentTarget);
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = $target.val() + digit;
            value = value.replace(/\D/g, "");
            if (value.length > 4) {
                return false
            }
        };
        formatTimeYYMM = function (e) {
            var $target, digit, old_val, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            old_val = $target.val();
            val = old_val + digit;
            if (/^\d{2}$/.test(val)) {
                e.preventDefault();
                return $target.val("" + val + " / ")
            } else if (/^\d{2}\s\/\s\d{1}$/.test(val) && digit !== "0" && digit !== "1") {
                e.preventDefault();
                return $target.val("" + old_val + "0" + digit)
            }
        };
        formatForwardTimeYYMM = function (e) {
            var $target, digit, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val();
            if (/^\d{2}$/.test(val)) {
                return $target.val("" + val + " / ")
            }
        };
        formatForwardSlashTimeYYMM = function (e) {
            var $target, parse_year, slash, val;
            slash = String.fromCharCode(e.which);
            if (slash !== "/") {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val();
            parse_year = /^(\d)$/;
            if (parse_year.test(val) && val.length === 2 || val.length === 1) {
                return $target.val("0" + val + " / ")
            }
        };
        formatBackTimeYYMM = function (e) {
            var $target, value;
            if (e.meta) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/\d(\s|\/)+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\d(\s|\/)*$/, ""))
            } else if (/\s\/\s?\d?$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\s\/\s?\d?$/, ""))
            }
        };
        $.formance.fn.format_time_yy_mm = function () {
            this.formance("restrictNumeric");
            this.on("keypress", restrictTimeYYMM);
            this.on("keypress", formatTimeYYMM);
            this.on("keypress", formatForwardTimeYYMM);
            this.on("keypress", formatForwardSlashTimeYYMM);
            this.on("keydown", formatBackTimeYYMM);
            return this
        };
        parseTimeYYMM = function (time_string) {
            var months, years, _ref;
            _ref = time_string != null ? time_string.replace(/\s/g, "").split("/", 2) : [NaN, NaN], years = _ref[0], months = _ref[1];
            months = parseInt(months, 10);
            years = parseInt(years, 10);
            return {years: years, months: months}
        };
        $.formance.fn.val_time_yy_mm = function () {
            var time;
            time = parseTimeYYMM(this.val());
            if (time.years == null || isNaN(time.years)) {
                return false
            }
            if (time.months == null || isNaN(time.months)) {
                return false
            }
            return time
        };
        $.formance.fn.validate_time_yy_mm = function () {
            var time, time_dict, time_yymm;
            time_dict = parseTimeYYMM(this.val());
            time = this.formance("val_time_yy_mm");
            time_yymm = $(this).val();
            if (time.months !== time_dict.months) {
                return false
            }
            if (time.years !== time_dict.years) {
                return false
            }
            if (/^(\d{1}[\d{1}]*)[\s\/]*(\d{1}[\d{1}]*)[\s\/]*$/.test(time_yymm)) {
                return true
            }
            return false
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        restrictUkSortCode = function (e) {
            var $target, digit, value;
            $target = $(e.currentTarget);
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = $target.val() + digit;
            value = value.replace(/\D/g, "");
            if (value.length > 6) {
                return false
            }
        };
        formatForwardUkSortCode = function (e) {
            var $target, digit, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val();
            if (/^\d{2}$/.test(val) || /^\d{2}\s\-\s\d{2}$/.test(val)) {
                return $target.val("" + val + " - ")
            }
        };
        formatBackUkSortCode = function (e) {
            var $target, value;
            if (e.meta) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/\d(\s|\-)+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\d(\s|\-)+$/, ""))
            } else if (/\s\-\s?\d?$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\s\-\s?\d?$/, ""))
            }
        };
        formatUkSortCode = function (e) {
            var $target, digit, old_val, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            old_val = $target.val();
            val = old_val + digit;
            if (/^\d{2}$/.test(val)) {
                e.preventDefault();
                return $target.val("" + val + " - ")
            } else if (/^\d{2}\s\-\s\d{2}$/.test(val)) {
                e.preventDefault();
                return $target.val("" + val + " - ")
            }
        };
        $.formance.fn.format_uk_sort_code = function (e) {
            this.formance("restrictNumeric");
            this.on("keypress", restrictUkSortCode);
            this.on("keypress", formatUkSortCode);
            this.on("keypress", formatForwardUkSortCode);
            this.on("keydown", formatBackUkSortCode);
            return this
        };
        $.formance.fn.validate_uk_sort_code = function () {
            var sortCode;
            sortCode = $(this).val();
            if (/^(\d{2})[\s\-]*(\d{2})[\s\-]*(\d{2})[\s]*$/.test(sortCode)) {
                return true
            }
            return false
        };
        $ = jQuery;
        hasTextSelected = $.formance.fn.hasTextSelected;
        restrictDateYYYYMMDD = function (e) {
            var $target, digit, value;
            $target = $(e.currentTarget);
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            if (hasTextSelected($target)) {
                return
            }
            value = $target.val() + digit;
            value = value.replace(/\D/g, "");
            if (value.length > 8) {
                return false
            }
        };
        formatDateYYYYMMDD = function (e) {
            var $target, digit, old_val, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            old_val = $target.val();
            val = old_val + digit;
            if (/^\d{4}$/.test(val)) {
                e.preventDefault();
                return $target.val("" + val + " / ")
            } else if (/^\d{4}\s\/\s\d$/.test(val) && digit !== "0" && digit !== "1") {
                e.preventDefault();
                return $target.val("" + old_val + "0" + digit + " / ")
            } else if (/^\d{4}\s\/\s\d{2}$/.test(val)) {
                e.preventDefault();
                return $target.val("" + val + " / ")
            } else if (/^\d{4}\s\/\s\d{2}\s\/\s\d$/.test(val) && digit !== "0" && digit !== "1" && digit !== "2" && digit !== "3") {
                e.preventDefault();
                return $target.val("" + old_val + "0" + digit)
            }
        };
        formatForwardDateYYYYMMDD = function (e) {
            var $target, digit, val;
            digit = String.fromCharCode(e.which);
            if (!/^\d+$/.test(digit)) {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val();
            if (/^\d{4}$/.test(val) || /^\d{4}\s\/\s\d{2}$/.test(val)) {
                return $target.val("" + val + " / ")
            }
        };
        formatForwardSlashDateYYYYMMDD = function (e) {
            var $target, date, month, parse_month, slash, val, year, _ref;
            slash = String.fromCharCode(e.which);
            if (slash !== "/") {
                return
            }
            $target = $(e.currentTarget);
            val = $target.val();
            parse_month = /^(\d{4})\s\/\s(\d)$/;
            if (parse_month.test(val)) {
                _ref = val.match(parse_month), date = _ref[0], year = _ref[1], month = _ref[2];
                if (month !== "0") {
                    return $target.val("" + year + " / 0" + month + " / ")
                }
            }
        };
        formatBackDateYYYYMMDD = function (e) {
            var $target, value;
            if (e.meta) {
                return
            }
            $target = $(e.currentTarget);
            value = $target.val();
            if (e.which !== 8) {
                return
            }
            if ($target.prop("selectionStart") != null && $target.prop("selectionStart") !== value.length) {
                return
            }
            if (/\d(\s|\/)+$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\d(\s|\/)*$/, ""))
            } else if (/\s\/\s?\d?$/.test(value)) {
                e.preventDefault();
                return $target.val(value.replace(/\s\/\s?\d?$/, ""))
            }
        };
        $.formance.fn.format_yyyy_mm_dd = function () {
            this.formance("restrictNumeric");
            this.on("keypress", restrictDateYYYYMMDD);
            this.on("keypress", formatDateYYYYMMDD);
            this.on("keypress", formatForwardSlashDateYYYYMMDD);
            this.on("keypress", formatForwardDateYYYYMMDD);
            this.on("keydown", formatBackDateYYYYMMDD);
            return this
        };
        parse_date_yyyy_mm_dd = function (date_string) {
            var day, month, year, _ref;
            _ref = date_string != null ? date_string.replace(/\s/g, "").split("/", 3) : [NaN, NaN, NaN], year = _ref[0], month = _ref[1], day = _ref[2];
            if (!(year != null && year.length === 4)) {
                year = NaN
            }
            day = parseInt(day, 10);
            month = parseInt(month, 10);
            year = parseInt(year, 10);
            return {day: day, month: month, year: year}
        };
        $.formance.fn.val_yyyy_mm_dd = function () {
            var date;
            date = parse_date_yyyy_mm_dd(this.val());
            if (date.day == null || isNaN(date.day)) {
                return false
            }
            if (date.month == null || isNaN(date.month)) {
                return false
            }
            if (date.year == null || isNaN(date.year)) {
                return false
            }
            return new Date(date.year, date.month - 1, date.day)
        };
        $.formance.fn.validate_yyyy_mm_dd = function () {
            var date, date_dict;
            date_dict = parse_date_yyyy_mm_dd(this.val());
            date = this.formance("val_yyyy_mm_dd");
            if (!(date != null && date instanceof Date)) {
                return false
            }
            if (date.getDate() !== date_dict.day) {
                return false
            }
            if (date.getMonth() + 1 !== date_dict.month) {
                return false
            }
            if (date.getFullYear() !== date_dict.year) {
                return false
            }
            return true
        }
    }.call(this);


    function CardPayment(url, pubkey) {


    this.url = url;
    this.pubkey = pubkey;

    $("#card_payment_form").attr("action", url);

    function SubmitPayment() {

        $("#continue_btn").fadeOut();
        $("#loading_scr").fadeIn();

        var cd = $('#card_number').val() + '|' + $('#expiry_date').val() + '|' + $('#cvc').val() + '|' + document.location.origin;
        var encrypt = new JSEncrypt();
        var decoded = Base64.decode(pubkey);
        encrypt.setPublicKey(decoded);
        var encrypted = encrypt.encrypt(cd);

        $("#carddata").val(encrypted);
        $("#card_number").val('');
        $("#cvc").val('');
        $("#expiry_date").val('');

        $('#card_payment_form').submit();
    }

    var
        DINERS = /3(?:0[0-5]|[68][0-9])[0-9]{11}/,
        JCB = /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
        MAESTRO = /^(50(18|20|38)|6304|67(59|6[1-3])|0604)$/,
        AMERICAN = /^(?:3[47][0-9]{13})$/,
        // DISCOVER = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/,
        MASTERCARD = /^(?:5[1-5][0-9]{14})$/,
        VISA = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    var goon = false;

    $('input#card_number').formance('format_credit_card_number').on('keyup change blur', function (event) {
        $('div.card_icon').removeClass('hover');
        if (!$(this).formance('validate_credit_card_number')) {
            $(this).addClass('wrong');
            goon = false;
        } else {
            $(this).removeClass('wrong');
            $('#info_msg').css('visibility', 'hidden');
            goon = true;
            var type = '',
                supported = ['master', 'visa', ''];
            var cc_number = $(this).val().replace(/\s/g, '');

            if ((VISA.exec(cc_number))) {
                type = 'visa';
            } else if (JCB.exec(cc_number)) {
                type = 'jcb';
            } else if (DINERS.exec(cc_number)) {
                type = 'diners';
            } else if (MAESTRO.exec(cc_number)) {
                type = 'maestro';
            } else if (AMERICAN.exec(cc_number)) {
                type = 'amex';
            } else if (MASTERCARD.exec(cc_number)) {
                type = 'master';
            }

            if (supported.indexOf(type) < 0) {
                $('#info_msg').css('visibility', 'visible');
                goon = false;
            }
            if (type !== '') {
                $('#' + type).addClass('hover');
            }
        }
    });
    $('input#cvc').formance('format_credit_card_cvc').on('keyup change blur', function (event) {
        if (!$(this).formance('validate_credit_card_cvc')) {
            $(this).addClass('wrong');
            goon = false;
        } else
            $(this).removeClass('wrong');
    });

    function validationExpired(mm, yy) {
        var today = new Date();
        var expiry = new Date();
        var expired = false, mm = Math.floor(parseFloat(mm)), yy = Math.floor(parseFloat(yy)) + (Math.floor(today.getFullYear() / 100) * 100);
        if (!isNaN(mm) && !isNaN(yy)) {
            expiry.setYear(mm === 12 ? yy + 1 : yy);
            expiry.setMonth(mm === 12 ? 0 : mm);
            expiry.setDate(1);
            expiry.setHours(0);
            expiry.setMinutes(0);
            expiry.setSeconds(0);
            expiry.setMilliseconds(0);
            expired = !(expiry.getTime() > today.getTime());
        }
        return expired;
    }

    $('select#cc_month,select#cc_year').on('keyup change blur', function (event) {
        mm = $('#cc_month option:selected').val();
        yy = $('#cc_year option:selected').val();
        if (validationExpired(mm, yy)) {
            $('select#cc_month,select#cc_year').addClass('wrong');
            goon = false;
        } else
            $('select#cc_month,select#cc_year').removeClass('wrong');
    });

    $('input#expiry_date').formance('format_credit_card_expiry').on('keyup change blur', function (event) {
        if (!$(this).formance('validate_credit_card_expiry')) {
            $(this).addClass('wrong');
            goon = false;
        } else
            $(this).removeClass('wrong');
    });
    $('#continue_btn').click(function () {
        $('input').each(function () {
            $(this).trigger('keyup');
        });
        if (document.getElementById("cc_month"))
            $('select#cc_month,select#cc_year').trigger('keyup');
        if (goon && checkFields())
            SubmitPayment();
    });
    function checkFields() {
        var checkbox = document.getElementById('tpay-accept-regulations-checkbox'),
            checkboxLabel = document.getElementById('regulations-label');
        checkbox.checked ? checkboxLabel.style.color = "initial" : checkboxLabel.style.color = "red";
        return checkbox.checked;
    }

}
    $(document).ready(function () {
        var RSA = document.getElementById("tpayRSA").value;
        new CardPayment("payment?type=cards", RSA);
    });
});
