export var config = {}


config.jwt = {
    tokenKey: 'chym_token'
}

config.campaignTypes = {
    '1': {
        label: 'Image 360',
        name: 'IMG_360'
    },
    // '2': {
    //     label: 'Video 360',
    //     name: 'VID_360'
    // }
}

config.defaultCampaignType = 1;

config.pricings = {
    '1': 'CPM',
    '2': 'CPC'
}

config.defaultPricing = 1;