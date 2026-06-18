import 'dotenv/config';

export default {
    "expo": {
        "name": "Parrots",
        "slug": "parrots",
        "owner": "ahmetzeren",
        "version": "1.0.17",
        "scheme": "parrotsapp",
        "orientation": "portrait",
        "icon": "./assets/parrotslogoblue_icon.png",
        "userInterfaceStyle": "light",
        "splash": {
            "image": "./assets/parrotslogowithtext.jpeg",
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
        },
        "assetBundlePatterns": [
            "**/*"
        ],
        "ios": {
            "bundleIdentifier": "com.zenforest.parrots",
            "supportsTablet": true,
            "config": {
                "googleMapsApiKey": process.env.GOOGLE_MAPS_API_KEY
            },
            "associatedDomains": [
                "applinks:parrotsvoyages.com"
            ],
            "infoPlist": {
                "CFBundleURLTypes": [
                    {
                        "CFBundleURLSchemes": [
                            "parrotsapp",
                            "com.googleusercontent.apps.938579686654-ol0d3lf5omaubr3j91l7t0dgbhfbr6mo"
                        ]
                    }
                ]
            }
        },
        "android": {
            "softwareKeyboardLayoutMode": "resize",
            "package": "com.zenforest.parrots",
            "googleServicesFile": "./google-services.json",
            "versionCode": 18,
            "intentFilters": [
                {
                    "action": "VIEW",
                    "autoVerify": true,
                    "data": [
                        { "scheme": "https", "host": "parrotsvoyages.com", "pathPrefix": "/profile-public" },
                        { "scheme": "https", "host": "parrotsvoyages.com", "pathPrefix": "/voyage-details" },
                        { "scheme": "https", "host": "parrotsvoyages.com", "pathPrefix": "/vehicle-details" }
                    ],
                    "category": ["BROWSABLE", "DEFAULT"]
                }
            ],
            "permissions": [
                "android.permission.ACCESS_COARSE_LOCATION",
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.RECORD_AUDIO"
            ],
            "config": {
                "googleMaps": {
                    "apiKey": process.env.GOOGLE_MAPS_API_KEY
                }
            }
        },
        "web": {
            "favicon": "./assets/favicon.png"
        },
        "plugins": [
            [
                "expo-image-picker",
                { "photosPermission": "The app accesses your photos to let you share them with your friends." }
            ],
            [
                "expo-notifications",
                { "icon": "./assets/parrotslogoblue_icon.png", "color": "#ffffff" }
            ],
            "expo-font",
            "expo-build-properties",
            "expo-web-browser",
            "@react-native-google-signin/google-signin",
        ],
        "extra": {
            "eas": {
                "projectId": "5f4ee090-1e51-4228-b36b-23715333bcc4"
            }
        }
    }
};