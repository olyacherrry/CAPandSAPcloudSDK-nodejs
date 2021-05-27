const { BusinessPartnerAddress } = require("@sap/cloud-sdk-vdm-business-partner-service");

const _prepareBody = (address) => {
    return {
        businessPartner: address.BusinessPartner,
        country: address.Country,
        postalCode: address.PostalCode,
        cityName: address.CityName,
        streetName: address.StreetName,
        houseNumber: address.HouseNumber
    }
}

const buildAddressForCreate = (req) => {
    const address = BusinessPartnerAddress.builder().fromJson(_prepareBody(req.data));
    if (req.params[0]) {
        const { BusinessPartner } = req.params[0];
        address.businessPartner = BusinessPartner;
    }
    return address;
}

const buildAddressForUpdate = (req) => {
    const { BusinessPartner, AddressID } = req.params[0];
    const address = BusinessPartnerAddress.builder().fromJson(_prepareBody(req.data));
    address.businessPartner = BusinessPartner;
    address.addressId = AddressID;
    return address;
}

const prepareResult = (address) => {
    return {
        BusinessPartner: address.businessPartner,
        AddressID: address.addressId,
        Country: address.country,
        PostalCode: address.postalCode,
        CityName: address.cityName,
        StreetName: address.streetName,
        HouseNumber: address.houseNumber
    }
}

module.exports = {
    buildAddressForCreate,
    buildAddressForUpdate,
    prepareResult
}