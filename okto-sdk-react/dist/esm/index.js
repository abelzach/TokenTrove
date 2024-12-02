import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, createContext, useMemo, useContext } from 'react';
import axios from 'axios';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var BuildType;
(function (BuildType) {
    BuildType["STAGING"] = "STAGING";
    BuildType["SANDBOX"] = "SANDBOX";
    BuildType["PRODUCTION"] = "PRODUCTION";
})(BuildType || (BuildType = {}));
var ModalType;
(function (ModalType) {
    ModalType["WIDGET"] = "WIDGET";
    ModalType["ONBOARDING"] = "ONBOARDING";
})(ModalType || (ModalType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["SUCCESS"] = "SUCCESS";
    OrderStatus["FAILED"] = "FAILED";
    OrderStatus["PENDING"] = "PENDING";
})(OrderStatus || (OrderStatus = {}));
var AuthType;
(function (AuthType) {
    AuthType["PHONE"] = "Phone";
    AuthType["EMAIL"] = "Email";
    AuthType["GAUTH"] = "GAuth";
})(AuthType || (AuthType = {}));

function getQueryString(query) {
    const queryParams = [];
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
            queryParams.push(`${key}=${value}`);
        }
    }
    const queryString = queryParams.join("&");
    return queryString;
}

const baseUrls = {
    [BuildType.PRODUCTION]: "https://apigw.okto.tech",
    [BuildType.STAGING]: "https://3p-bff.oktostage.com",
    [BuildType.SANDBOX]: "https://sandbox-api.okto.tech",
};
const onBoardingUrls = {
    [BuildType.PRODUCTION]: "https://3p.okto.tech/login_screen/#/login_screen",
    [BuildType.STAGING]: "https://3p.oktostage.com/#/login_screen",
    [BuildType.SANDBOX]: "https://okto-sandbox.firebaseapp.com/#/login_screen",
};
const widgetUrl = "https://3p.okto.tech";
const AUTH_DETAILS_KEY = "AUTH_DETAILS";
const defaultTheme = {
    textPrimaryColor: "0xFFFFFFFF",
    textSecondaryColor: "0xFFFFFFFF",
    textTertiaryColor: "0xFFFFFFFF",
    accent1Color: "0x80433454",
    accent2Color: "0x80905BF5",
    strokeBorderColor: "0xFFACACAB",
    strokeDividerColor: "0x4DA8A8A8",
    surfaceColor: "0xFF1F0A2F",
    backgroundColor: "0xFF000000",
};
const JOB_RETRY_INTERVAL = 5000; //5s
const JOB_MAX_RETRY = 12; //retry for 60s (12 * 5 = 60)

const storeJSONLocalStorage = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (e) {
        console.error("Error storing JSON data in local storage", e);
    }
});
const getJSONLocalStorage = (key) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue !== null && jsonValue !== "undefined") {
            const value = JSON.parse(jsonValue);
            return value;
        }
        return null;
    }
    catch (e) {
        console.error("Error getting JSON data from local storage", e);
    }
    return null;
});

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$3 = ".WidgetIframe-module_container__XpJd6{height:32rem;width:20rem}.WidgetIframe-module_iframe__pHk97{background-color:#000;border-radius:24px;height:100%;width:100%}.WidgetIframe-module_hidden__dpiV5{display:none}.WidgetIframe-module_block__VTCNM{display:block}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldpZGdldElmcmFtZS5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNDQUVFLFlBQWEsQ0FEYixXQUVGLENBRUEsbUNBSUUscUJBQXVCLENBRHZCLGtCQUFtQixDQURuQixXQUFZLENBRFosVUFJRixDQUVBLG1DQUNFLFlBQ0YsQ0FFQSxrQ0FDRSxhQUNGIiwiZmlsZSI6IldpZGdldElmcmFtZS5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRhaW5lciB7XG4gIHdpZHRoOiAyMHJlbTtcbiAgaGVpZ2h0OiAzMnJlbTtcbn1cblxuLmlmcmFtZSB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDI0cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xufVxuXG4uaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLmJsb2NrIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbiJdfQ== */";
var styles$3 = {"container":"WidgetIframe-module_container__XpJd6","iframe":"WidgetIframe-module_iframe__pHk97","hidden":"WidgetIframe-module_hidden__dpiV5","block":"WidgetIframe-module_block__VTCNM"};
styleInject(css_248z$3);

var css_248z$2 = ".Loading-module_loading__ccSwl{align-items:center;display:flex;height:100%;justify-content:center;width:100%}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvYWRpbmcubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFFRSxrQkFBbUIsQ0FEbkIsWUFBYSxDQUliLFdBQVksQ0FGWixzQkFBdUIsQ0FDdkIsVUFFRiIsImZpbGUiOiJMb2FkaW5nLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubG9hZGluZyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4uc3Bpbm5lciB7XG4gIC8qIEFkZCB5b3VyIHNwaW5uZXIgc3R5bGVzIGhlcmUgKi9cbn1cbiJdfQ== */";
var styles$2 = {"loading":"Loading-module_loading__ccSwl","spinner":"Loading-module_spinner__TOVv5"};
styleInject(css_248z$2);

function Loading() {
    return (React.createElement("div", { className: styles$2.loading },
        React.createElement("div", { className: styles$2.spinner }, "Loading...")));
}

function getInjectedData$1(modalData) {
    return {
        textPrimaryColor: modalData.theme.textPrimaryColor,
        textSecondaryColor: modalData.theme.textSecondaryColor,
        textTertiaryColor: modalData.theme.textTertiaryColor,
        accent1Color: modalData.theme.accent1Color,
        accent2Color: modalData.theme.accent2Color,
        strokeBorderColor: modalData.theme.strokeBorderColor,
        strokeDividerColor: modalData.theme.strokeDividerColor,
        surfaceColor: modalData.theme.surfaceColor,
        backgroundColor: modalData.theme.backgroundColor,
        ENVIRONMENT: modalData.environment,
        authToken: modalData.authToken,
    };
}
const WidgetIframe = ({ modalData, onClose, }) => {
    const iframeRef = useRef(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) {
            return;
        }
        iframe.onload = function () {
            onLoad();
        };
        function onLoad() {
            console.log(modalData);
            if (iframe && iframe.contentWindow && modalData) {
                const message = {
                    type: "FROM_PARENT",
                    data: getInjectedData$1(modalData),
                };
                iframe.contentWindow.postMessage(message, widgetUrl);
            }
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin === widgetUrl) {
                const message = event.data;
                if (message.type === "FROM_IFRAME") {
                    if (message.data === "CLOSE") {
                        onClose();
                    }
                }
            }
        };
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);
    return (React.createElement("div", { className: styles$3.container },
        loading && React.createElement(Loading, null),
        React.createElement("iframe", { ref: iframeRef, src: widgetUrl, className: styles$3.iframe, loading: "lazy" })));
};

var css_248z$1 = ".OktoModal-module_modalOverlay__7Bxvs{align-items:center;display:flex;inset:0;justify-content:center;position:fixed;z-index:50}.OktoModal-module_hidden__DFJwo{display:none}.OktoModal-module_modalContainer__8GLNJ{align-items:center;display:flex;inset:0;justify-content:center;position:fixed}.OktoModal-module_modalContent__KLXfE{border:2px solid #f5f6fe;border-radius:24px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9rdG9Nb2RhbC5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNDQU1FLGtCQUFtQixDQUZuQixZQUFhLENBRmIsT0FBUSxDQUdSLHNCQUF1QixDQUp2QixjQUFlLENBRWYsVUFJRixDQUVBLGdDQUNFLFlBQ0YsQ0FFQSx3Q0FLRSxrQkFBbUIsQ0FGbkIsWUFBYSxDQURiLE9BQVEsQ0FFUixzQkFBdUIsQ0FIdkIsY0FLRixDQUVBLHNDQUNFLHdCQUF5QixDQUN6QixrQkFBbUIsQ0FDbkIseUVBQ0YiLCJmaWxlIjoiT2t0b01vZGFsLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubW9kYWxPdmVybGF5IHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICBpbnNldDogMDtcbiAgei1pbmRleDogNTA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4uaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLm1vZGFsQ29udGFpbmVyIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICBpbnNldDogMDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5tb2RhbENvbnRlbnQge1xuICBib3JkZXI6IDJweCBzb2xpZCAjRjVGNkZFO1xuICBib3JkZXItcmFkaXVzOiAyNHB4O1xuICBib3gtc2hhZG93OiAwcHggMTBweCAxNXB4IC0zcHggcmdiYSgwLCAwLCAwLCAwLjEpLCAwcHggNHB4IDZweCAtMnB4IHJnYmEoMCwgMCwgMCwgMC4wNSk7XG59XG4iXX0= */";
var styles$1 = {"modalOverlay":"OktoModal-module_modalOverlay__7Bxvs","hidden":"OktoModal-module_hidden__DFJwo","modalContainer":"OktoModal-module_modalContainer__8GLNJ","modalContent":"OktoModal-module_modalContent__KLXfE"};
styleInject(css_248z$1);

// eslint-disable-next-line no-empty-pattern
const _OktoModal = ({}, ref) => {
    const [currentScreen, setCurrentScreen] = useState(null);
    const [modalData, setModalData] = useState(null);
    const openModal = (screen, widgetModalData = null) => {
        setCurrentScreen(screen);
        if (widgetModalData) {
            setModalData(widgetModalData);
        }
    };
    const closeModal = () => {
        setCurrentScreen(null);
    };
    useImperativeHandle(ref, () => ({
        openModal,
        closeModal,
    }));
    function handleClose() {
        closeModal();
    }
    return (React.createElement("div", { className: `${styles$1.modalOverlay} ${currentScreen ? "" : styles$1.hidden}`, onClick: handleClose },
        React.createElement("div", { className: styles$1.modalContainer },
            React.createElement("div", { className: styles$1.modalContent }, currentScreen === ModalType.WIDGET && (React.createElement(WidgetIframe, { modalData: modalData, onClose: handleClose }))))));
};
const OktoModal = forwardRef(_OktoModal);

var css_248z = ".OnboardingIframe-module_container__ZvV3p{height:32rem;width:20rem}.OnboardingIframe-module_iframe__K8QXo{background-color:#000;border-radius:24px;height:100%;width:100%}.OnboardingIframe-module_hidden__gdo8e{display:none}.OnboardingIframe-module_block__HuW3N{display:block}.OnboardingIframe-module_modalOverlay__nxkfi{z-index:50}.OnboardingIframe-module_modalContainer__p4jBX,.OnboardingIframe-module_modalOverlay__nxkfi{align-items:center;display:flex;inset:0;justify-content:center;position:fixed}.OnboardingIframe-module_modalContent__xz7G3{border:2px solid #f5f6fe;border-radius:24px;box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9uYm9hcmRpbmdJZnJhbWUubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQ0FFRSxZQUFhLENBRGIsV0FFRixDQUVBLHVDQUlFLHFCQUF1QixDQUR2QixrQkFBbUIsQ0FEbkIsV0FBWSxDQURaLFVBSUYsQ0FFQSx1Q0FDRSxZQUNGLENBRUEsc0NBQ0UsYUFDRixDQUVBLDZDQUdFLFVBSUYsQ0FFQSw0RkFIRSxrQkFBbUIsQ0FGbkIsWUFBYSxDQUZiLE9BQVEsQ0FHUixzQkFBdUIsQ0FKdkIsY0FjRixDQUVBLDZDQUNFLHdCQUF5QixDQUN6QixrQkFBbUIsQ0FDbkIseUVBQ0YiLCJmaWxlIjoiT25ib2FyZGluZ0lmcmFtZS5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRhaW5lciB7XG4gIHdpZHRoOiAyMHJlbTtcbiAgaGVpZ2h0OiAzMnJlbTtcbn1cblxuLmlmcmFtZSB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDI0cHg7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xufVxuXG4uaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLmJsb2NrIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi5tb2RhbE92ZXJsYXkge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGluc2V0OiAwO1xuICB6LWluZGV4OiA1MDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5tb2RhbENvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgaW5zZXQ6IDA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4ubW9kYWxDb250ZW50IHtcbiAgYm9yZGVyOiAycHggc29saWQgI0Y1RjZGRTtcbiAgYm9yZGVyLXJhZGl1czogMjRweDtcbiAgYm94LXNoYWRvdzogMHB4IDEwcHggMTVweCAtM3B4IHJnYmEoMCwgMCwgMCwgMC4xKSwgMHB4IDRweCA2cHggLTJweCByZ2JhKDAsIDAsIDAsIDAuMDUpO1xufVxuIl19 */";
var styles = {"container":"OnboardingIframe-module_container__ZvV3p","iframe":"OnboardingIframe-module_iframe__K8QXo","hidden":"OnboardingIframe-module_hidden__gdo8e","block":"OnboardingIframe-module_block__HuW3N","modalOverlay":"OnboardingIframe-module_modalOverlay__nxkfi","modalContainer":"OnboardingIframe-module_modalContainer__p4jBX","modalContent":"OnboardingIframe-module_modalContent__xz7G3"};
styleInject(css_248z);

function getInjectedData(modalData) {
    return {
        textPrimaryColor: modalData.theme.textPrimaryColor,
        textSecondaryColor: modalData.theme.textSecondaryColor,
        textTertiaryColor: modalData.theme.textTertiaryColor,
        accent1Color: modalData.theme.accent1Color,
        accent2Color: modalData.theme.accent2Color,
        strokeBorderColor: modalData.theme.strokeBorderColor,
        strokeDividerColor: modalData.theme.strokeDividerColor,
        surfaceColor: modalData.theme.surfaceColor,
        backgroundColor: modalData.theme.backgroundColor,
        ENVIRONMENT: modalData.environment,
        API_KEY: modalData.apiKey,
        primaryAuthType: modalData.primaryAuthType.toString(),
        brandTitle: modalData.brandTitle,
        brandSubtitle: modalData.brandSubtitle,
        brandIconUrl: modalData.brandIconUrl,
    };
}
const OnboardingIframe = ({ modalData, onClose, updateAuthCb, gAuthCb, }) => {
    const iframeRef = useRef(null);
    const widgetUrl = onBoardingUrls[modalData.environment];
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) {
            return;
        }
        iframe.onload = function () {
            onLoad();
        };
        function onLoad() {
            if (iframe && iframe.contentWindow && modalData) {
                const message = {
                    type: "FROM_PARENT",
                    data: getInjectedData(modalData),
                };
                iframe.contentWindow.postMessage(message, widgetUrl);
            }
        }
    }, []);
    useEffect(() => {
        const handleMessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const message = JSON.parse(event.data);
                if (message.type === "go_back") {
                    onClose();
                }
                else if (message.type === "g_auth") {
                    //handle google auth
                    const idToken = yield gAuthCb();
                    (_b = (_a = iframeRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage(JSON.stringify({ type: "g_auth", data: idToken }), widgetUrl);
                }
                else if (message.type === "copy_text") {
                    //handle copy text
                    const clipboardText = yield navigator.clipboard.readText();
                    const trimmedText = clipboardText.trim();
                    (_d = (_c = iframeRef.current) === null || _c === void 0 ? void 0 : _c.contentWindow) === null || _d === void 0 ? void 0 : _d.postMessage(JSON.stringify({ type: "copy_text", data: trimmedText }), widgetUrl);
                }
                else if (message.type === "auth_success") {
                    //handle auth success
                    const authData = message.data;
                    const authDetails = {
                        authToken: authData.auth_token,
                        refreshToken: authData.refresh_auth_token,
                        deviceToken: authData.device_token,
                    };
                    updateAuthCb(authDetails);
                }
            }
            catch (error) {
                console.error("Error parsing okto widget data", error);
            }
        });
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);
    return (React.createElement("div", { className: `${styles.modalOverlay} ${modalData ? "" : styles.hidden}`, onClick: onClose },
        React.createElement("div", { className: styles.modalContainer },
            React.createElement("div", { className: styles.modalContent },
                React.createElement("div", { className: styles.container },
                    React.createElement("iframe", { ref: iframeRef, src: widgetUrl, className: styles.iframe, loading: "eager" }))))));
};

// eslint-disable-next-line no-empty-pattern
const _OnboardingModal = ({ updateAuthCb, gAuthCb, }, ref) => {
    const [modalData, setModalData] = useState(null);
    const openModal = (onboardingModalData) => {
        setModalData(onboardingModalData);
    };
    const closeModal = () => {
        setModalData(null);
    };
    useImperativeHandle(ref, () => ({
        openModal,
        closeModal,
    }));
    function handleClose() {
        closeModal();
    }
    if (!modalData) {
        return null;
    }
    return (React.createElement(OnboardingIframe, { modalData: modalData, onClose: handleClose, updateAuthCb: updateAuthCb, gAuthCb: gAuthCb }));
};
const OnboardingModal = forwardRef(_OnboardingModal);

const OktoContext = createContext(null);
const OktoProvider = ({ children, apiKey, buildType, gAuthCb, }) => {
    const oktoModalRef = useRef(null);
    const onboardingModalRef = useRef(null);
    const baseUrl = useMemo(() => baseUrls[buildType], [buildType]);
    const [authDetails, setAuthDetails] = useState(null);
    const [theme, updateTheme] = useState(defaultTheme);
    const isLoggedIn = useMemo(() => authDetails !== null, [authDetails]);
    const axiosInstance = useMemo(() => {
        const axiosInstanceTmp = axios.create({
            baseURL: `${baseUrl}/api`,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
        });
        // Request Interceptor to add Auth tokens to every request
        axiosInstanceTmp.interceptors.request.use((config) => {
            if (authDetails === null || authDetails === void 0 ? void 0 : authDetails.authToken) {
                config.headers.Authorization = `Bearer ${authDetails.authToken}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        // Response interceptor to handle 401 errors
        axiosInstanceTmp.interceptors.response.use((response) => response, (error) => __awaiter(void 0, void 0, void 0, function* () {
            const originalRequest = error.config;
            if (error.response.status === 401) {
                try {
                    const newAuthDetails = yield refreshToken(); // Attempt to refresh token
                    if (newAuthDetails) {
                        // Update the Authorization header with the new access token
                        originalRequest.headers.Authorization = `Bearer ${newAuthDetails.authToken}`;
                        return axios(originalRequest);
                    }
                }
                catch (refreshError) {
                    // Handle refresh token errors
                    updateAuthDetails(null); // Clear auth details if refresh fails
                    return Promise.reject(refreshError);
                }
            }
            // Return the Promise rejection if refresh didn't work or error is not due to 401
            return Promise.reject(error);
        }));
        return axiosInstanceTmp;
    }, [apiKey, authDetails, baseUrl]);
    useEffect(() => {
        updateAuthDetailsFromStorage();
    }, []);
    function updateAuthDetailsFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const storedAuthDetails = yield getJSONLocalStorage(AUTH_DETAILS_KEY);
            setAuthDetails(storedAuthDetails);
        });
    }
    function updateAuthDetails(authDetailsNew) {
        return __awaiter(this, void 0, void 0, function* () {
            setAuthDetails(authDetailsNew);
            yield storeJSONLocalStorage(AUTH_DETAILS_KEY, authDetailsNew);
        });
    }
    function refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (authDetails) {
                try {
                    const response = yield axios.post(`${baseUrl}/api/v1/refresh_token`, {}, {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${authDetails === null || authDetails === void 0 ? void 0 : authDetails.authToken}`,
                            "x-refresh-authorization": `Bearer ${authDetails.refreshToken}`,
                            "x-device-token": authDetails.deviceToken,
                            "x-api-key": apiKey,
                        },
                    });
                    const authDetailsNew = {
                        authToken: response.data.data.auth_token,
                        refreshToken: response.data.data.refresh_auth_token,
                        deviceToken: response.data.data.device_token,
                    };
                    updateAuthDetails(authDetailsNew);
                    console.log("Refresh token: ", "success");
                    return authDetailsNew;
                }
                catch (error) {
                    throw new Error("Failed to refresh token");
                }
            }
            return null;
        });
    }
    function authenticate(idToken, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!axiosInstance) {
                return callback(null, new Error("SDK is not initialized"));
            }
            try {
                const response = yield axios.post(`${baseUrl}/api/v2/authenticate`, {
                    id_token: idToken,
                }, {
                    headers: {
                        Accept: "*/*",
                        "x-api-key": apiKey,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 200 &&
                    response.data &&
                    response.data.status === "success") {
                    //check if token in data then open pincode flow
                    if (response.data.data.auth_token) {
                        const authDetailsNew = {
                            authToken: response.data.data.auth_token,
                            refreshToken: response.data.data.refresh_auth_token,
                            deviceToken: response.data.data.device_token,
                        };
                        updateAuthDetails(authDetailsNew);
                    }
                    callback(response.data.data, null);
                }
                else {
                    callback(null, new Error("Server responded with an error"));
                }
            }
            catch (error) {
                callback(null, error);
            }
        });
    }
    function authenticateWithUserId(userId, jwtToken, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!axiosInstance) {
                return callback(null, new Error("SDK is not initialized"));
            }
            try {
                const response = yield axios.post(`${baseUrl}/api/v1/jwt-authenticate`, {
                    user_id: userId,
                    auth_token: jwtToken,
                }, {
                    headers: {
                        Accept: "*/*",
                        "x-api-key": apiKey,
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 200 &&
                    response.data &&
                    response.data.status === "success") {
                    const authDetailsNew = {
                        authToken: response.data.data.auth_token,
                        refreshToken: response.data.data.refresh_auth_token,
                        deviceToken: response.data.data.device_token,
                    };
                    updateAuthDetails(authDetailsNew);
                    callback(response.data.data, null);
                }
                else {
                    callback(null, new Error("Server responded with an error"));
                }
            }
            catch (error) {
                callback(null, error);
            }
        });
    }
    function makeGetRequest(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, queryUrl = null) {
            if (!axiosInstance) {
                throw new Error("SDK is not initialized");
            }
            const url = queryUrl ? `${endpoint}?${queryUrl}` : endpoint;
            try {
                const response = yield axiosInstance.get(url);
                if (response.data.status === "success") {
                    return response.data.data;
                }
                else {
                    throw new Error("Server responded with an error");
                }
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Unknown error");
            }
        });
    }
    function makePostRequest(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, data = null) {
            if (!axiosInstance) {
                throw new Error("SDK is not initialized");
            }
            try {
                const response = yield axiosInstance.post(endpoint, data);
                if (response.data.status === "success") {
                    return response.data.data;
                }
                else {
                    throw new Error("Server responded with an error");
                }
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Unknown error");
            }
        });
    }
    function getPortfolio() {
        return __awaiter(this, void 0, void 0, function* () {
            return makeGetRequest("/v1/portfolio");
        });
    }
    function getSupportedTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            return makeGetRequest("/v1/supported/tokens");
        });
    }
    function getSupportedNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            return makeGetRequest("/v1/supported/networks");
        });
    }
    function getUserDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            return makeGetRequest("/v1/user_from_token");
        });
    }
    function getWallets() {
        return __awaiter(this, void 0, void 0, function* () {
            return makeGetRequest("/v1/wallet");
        });
    }
    function orderHistory(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = getQueryString(query);
            return makeGetRequest("/v1/orders", queryString);
        });
    }
    function getNftOrderDetails(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = getQueryString(query);
            return makeGetRequest("/v1/nft/order_details", queryString);
        });
    }
    function getRawTransactionStatus(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = getQueryString(query);
            return makeGetRequest("/v1/rawtransaction/status", queryString);
        });
    }
    function createWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/wallet");
        });
    }
    function transferTokens(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/transfer/tokens/execute", data);
        });
    }
    function transferTokensWithJobStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = yield transferTokens(data);
                console.log("Transfer tokens order ID", orderId);
                return yield waitForJobCompletion(orderId, (_orderId) => __awaiter(this, void 0, void 0, function* () {
                    const orderData = yield orderHistory({ order_id: _orderId });
                    const order = orderData.jobs.find((item) => item.order_id === _orderId);
                    if (order &&
                        (order.status === OrderStatus.SUCCESS ||
                            order.status === OrderStatus.FAILED)) {
                        return order;
                    }
                    throw new Error(`Order with ID ${_orderId} not found or not completed.`);
                }));
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Unknown error");
            }
        });
    }
    function transferNft(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/nft/transfer", data);
        });
    }
    function transferNftWithJobStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { order_id } = yield transferNft(data);
                console.log("Transfer nfts order ID", order_id);
                return yield waitForJobCompletion(order_id, (orderId) => __awaiter(this, void 0, void 0, function* () {
                    const orderData = yield getNftOrderDetails({
                        order_id: orderId,
                    });
                    const order = orderData.nfts.find((item) => item.id === orderId);
                    if (order) {
                        return order;
                    }
                    throw new Error(`Order with ID ${orderId} not found or not completed.`);
                }));
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Unknown error");
            }
        });
    }
    function executeRawTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/rawtransaction/execute", data);
        });
    }
    function executeRawTransactionWithJobStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = yield executeRawTransaction(data);
                console.log("Execute Raw transaction called with Job ID", jobId);
                return yield waitForJobCompletion(jobId, (orderId) => __awaiter(this, void 0, void 0, function* () {
                    const orderData = yield getRawTransactionStatus({
                        order_id: orderId,
                    });
                    const order = orderData.jobs.find((item) => item.order_id === orderId);
                    if (order &&
                        (order.status === OrderStatus.SUCCESS ||
                            order.status === OrderStatus.FAILED)) {
                        return order;
                    }
                    throw new Error(`Order with ID ${orderId} not found or not completed.`);
                }));
            }
            catch (error) {
                throw error instanceof Error ? error : new Error("Unknown error");
            }
        });
    }
    function waitForJobCompletion(orderId, findJobCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let retryCount = 0; retryCount < JOB_MAX_RETRY; retryCount++) {
                try {
                    return yield findJobCallback(orderId);
                }
                catch (error) {
                    /* empty */
                }
                yield delay(JOB_RETRY_INTERVAL);
            }
            throw new Error(`Order ID not found or not completed.`);
        });
    }
    function delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
    function logOut() {
        return __awaiter(this, void 0, void 0, function* () {
            updateAuthDetails(null);
        });
    }
    function sendEmailOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/authenticate/email", {
                email,
            });
        });
    }
    function verifyEmailOTP(email, otp, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield makePostRequest("/v1/authenticate/email/verify", { email, otp, token });
                if (response.message === "success") {
                    const authDetails = {
                        authToken: response.auth_token,
                        refreshToken: response.refresh_auth_token,
                        deviceToken: response.device_token,
                    };
                    updateAuthDetails(authDetails);
                    return true;
                }
            }
            catch (error) {
                return false;
            }
            return false;
        });
    }
    function sendPhoneOTP(phoneNumber, countryShortName) {
        return __awaiter(this, void 0, void 0, function* () {
            return makePostRequest("/v1/authenticate/phone", {
                phone_number: phoneNumber,
                country_short_name: countryShortName,
            });
        });
    }
    function verifyPhoneOTP(phoneNumber, countryShortName, otp, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield makePostRequest("/v1/authenticate/phone/verify", {
                    phone_number: phoneNumber,
                    country_short_name: countryShortName,
                    otp,
                    token,
                });
                if (response.message === "success") {
                    const authDetails = {
                        authToken: response.auth_token,
                        refreshToken: response.refresh_auth_token,
                        deviceToken: response.device_token,
                    };
                    updateAuthDetails(authDetails);
                    return true;
                }
            }
            catch (error) {
                return false;
            }
            return false;
        });
    }
    function showWidgetModal() {
        var _a;
        (_a = oktoModalRef.current) === null || _a === void 0 ? void 0 : _a.openModal(ModalType.WIDGET, {
            theme,
            authToken: authDetails === null || authDetails === void 0 ? void 0 : authDetails.authToken,
            environment: buildType.toString(),
        });
    }
    function showOnboardingModal(primaryAuth = AuthType.EMAIL, title = "", subtitle = "", iconUrl = "") {
        var _a;
        (_a = onboardingModalRef.current) === null || _a === void 0 ? void 0 : _a.openModal({
            theme,
            apiKey,
            environment: buildType.toString(),
            primaryAuthType: primaryAuth,
            brandTitle: title,
            brandSubtitle: subtitle,
            brandIconUrl: iconUrl,
        });
    }
    function closeModal() {
        var _a;
        (_a = oktoModalRef.current) === null || _a === void 0 ? void 0 : _a.closeModal();
    }
    function setTheme(newTheme) {
        updateTheme(Object.assign(Object.assign({}, theme), newTheme));
    }
    function getTheme() {
        return theme;
    }
    return (React.createElement(OktoContext.Provider, { value: {
            isLoggedIn,
            authenticate,
            authenticateWithUserId,
            logOut,
            getPortfolio,
            getSupportedNetworks,
            getSupportedTokens,
            getUserDetails,
            getWallets,
            orderHistory,
            getNftOrderDetails,
            getRawTransactionStatus,
            createWallet,
            transferNft,
            transferNftWithJobStatus,
            transferTokens,
            transferTokensWithJobStatus,
            executeRawTransaction,
            executeRawTransactionWithJobStatus,
            showWidgetModal,
            showOnboardingModal,
            closeModal,
            setTheme,
            getTheme,
            sendEmailOTP,
            verifyEmailOTP,
            sendPhoneOTP,
            verifyPhoneOTP,
        } },
        children,
        React.createElement(OktoModal, { ref: oktoModalRef }),
        React.createElement(OnboardingModal, { ref: onboardingModalRef, updateAuthCb: updateAuthDetails, gAuthCb: gAuthCb ? gAuthCb : () => __awaiter(void 0, void 0, void 0, function* () { return ""; }) })));
};
const useOkto = () => useContext(OktoContext);

export { AuthType, BuildType, ModalType, OktoProvider, OrderStatus, useOkto };
//# sourceMappingURL=index.js.map
