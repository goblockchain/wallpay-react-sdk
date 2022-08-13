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

## Local Setup

1. Clone this repo `git clone https://github.com/goblockchain/wallpay-react-sdk.git`
2. Go to the folder where of the cloned repo
  2.1 Install its dependencies `yarn install`
  2.2 Build the package `yarn run build`
  2.3 Register its link `yarn link`
3. Go to your React application's folder
  3.1 Create a link to the package's folder `yarn link wallpay-react-sdk`
  3.2 Add wallpay-react-sdk as one of your app's dependencies like below
  ```
  "dependencies": {
    [... other dependencies]
    "wallpay-react-sdk": "your/path/to/wallpay-react-sdk"
  }
  ```
  3.3 Install the app's dependencies `yarn install`

Whenever a change is made to the local version of the SDK, follow the next steps to properly update the codebase being used as a dependency of your app:

1. Go to the folder where of the SDK repo
  1.2 Build the package `yarn run build`
2. Go to the folder where of the React application
  2.1 Remove wallpay-react-sdk from `yarn.lock`
  2.2 Install the dependencies again `yarn install`