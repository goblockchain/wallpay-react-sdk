# wallpay-react-sdk

Wallpay React SDK is a set of tools to easily integrate your app with Wallpay's payment gateway (learn more at https://sites.google.com/goblockchain.io/wallpay/home)

## Setup

1. Intall the SDK as a dependency of your React application

```
npm install wallpay-react-sdk

or

yarn add wallpay-react-sdk
```

2. Create a `wallpay.ts` file such as below

```
import WallpaySDK from 'wallpay-react-sdk';

const wallpaySDK = WallpaySDK('MY_PRIVATE_KEY');

export default wallpaySDK;
```

3. Use the exported tools through wallpaySDK

```
import wallpaySDK from 'src/utils/wallpay';

const {
  PaymentModal,
  PaymentProvider,
  usePayment,
} = wallpaySDK;

<PaymentModal
  onClose={onClose}
  paymentData={{
    PriceBRL: paymentData.fiatPrice,
    fixedPrice: paymentData.price,
    itemName: paymentData.itemName,
    itemImage: paymentData.itemImage,
  }}
/>

<PaymentProvider>
  <Component />
</PaymentProvider>

const { onOpenPaymentModal } = usePayment();
```

## Local Setup

1. Clone this repo `git clone https://github.com/goblockchain/wallpay-react-sdk.git`
2. Go to the folder of the cloned repo
3. Install its dependencies `yarn install`
4. Build the package `yarn run build`
5. Register its link `yarn link`
6. Go to your React application's folder
7. Create a link to the package's folder `yarn link wallpay-react-sdk`
8. Add wallpay-react-sdk as one of your app's dependencies like below
  ```
  "dependencies": {
    [... other dependencies]
    "wallpay-react-sdk": "your/path/to/wallpay-react-sdk"
  }
  ```
9. Install the app's dependencies `yarn install` and it's ready to be used by the app

Whenever a change is made to the local version of the SDK, follow the next steps to properly update the codebase being used as a dependency of your app:

1. Go to the folder where of the SDK repo
2. Build the package `yarn run build`
3. Go to the folder where of the React application
4. Remove wallpay-react-sdk from `yarn.lock`
5. Install the dependencies again `yarn install`