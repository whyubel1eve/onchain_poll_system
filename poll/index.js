/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "react-native-get-random-values";

import { TextEncoder } from "text-encoding";
// import crypto from 'react-native-quick-crypto';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// global.crypto = crypto;

AppRegistry.registerComponent(appName, () => App);
