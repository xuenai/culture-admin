declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'clipboard' {
  const clipboard: any;
  export default clipboard;
}

declare module 'qrcodejs2' {
  const QRCode: any;
  export default QRCode;
}
declare module 'v-distpicker' {
  const VDistpicker: any;
  export default VDistpicker;
}
declare module 'awe-dnd' {
  const VueDND: any;
  export default VueDND;
}
declare module 'vue-aplayer' {
  const Aplayer: any;
  export default Aplayer;
}

declare module 'qs' {
  const qs: any;
  export default qs;
}

declare let AMap: any;
declare let city: any;
declare let AMapUI: any;

declare module 'vue-cropperjs';

declare module 'uuid/v4';