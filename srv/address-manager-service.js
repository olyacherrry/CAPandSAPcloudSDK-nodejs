const cds = require('@sap/cds');
const { BusinessPartnerAddress } = require("@sap/cloud-sdk-vdm-business-partner-service");
const sdkDest = { "destinationName": 'S4H_simple' };
const {
    buildAddressForCreate,
    buildAddressForUpdate,
    prepareResult,
    prepareBody
} = require('./helpers')

module.exports = cds.service.impl(async function () {

    //entities from address-manager-service.cds file
    const { BusinessPartners, BusinessPartnerAddresses } = this.entities;

    //external service  declared in package.json in the cds requires section
    const service = await cds.connect.to('API_BUSINESS_PARTNER');

    //GET http://localhost:4004/address-manager/BusinessPartners
    this.on('READ', BusinessPartners, async (req) => {
        try {
            const tx = service.transaction();

            //entity name as it is in the .csn  API_BUSINESS_PARTNER
            let entity = 'A_BusinessPartner';
            //columns which we have declared in cds entity that we want to expose
            let columnsToSelect = ["BusinessPartner", "FirstName", "LastName"];

            //if there is a parameter
            if (req.params[0]) {

                const businessPartner = req.params[0].BusinessPartner;
                return await tx.run(
                    SELECT.from(entity)
                        .columns(columnsToSelect)
                        .where({ 'BusinessPartner': businessPartner })
                )
            } else {
                //if no parameter, we read all Business Partners
                return await tx.run(
                    SELECT.from(entity)
                        .columns(columnsToSelect)
                )
            }

        } catch (err) {
            req.reject(err);
        }
    });


    //GET http://localhost:4004/address-manager/BusinessPartnerAddresses
    this.on('READ', BusinessPartnerAddresses, async (req) => {
        try {
            const tx = service.transaction();

            //entity name as it is in the .csn file for the service API_BUSINESS_PARTNER
            let entity = 'A_BusinessPartnerAddress';
            //columns which we have declared in cds entity that we want to expose
            let columnsToSelect = ["BusinessPartner", "AddressID", "Country", "PostalCode", "CityName", "StreetName", "HouseNumber"];

            //if there is parameter
            if (req.params[0]) {
                //If you look in the .csn file you will see that
                //the keys for our BusinessPartnerAddress entity are
                //BusinessPartner and AddressID columns
                const businessPartner = req.params[0].BusinessPartner;
                const addressId = req.params[0].AddressID;
                return await tx.run(
                    SELECT.from(entity)
                        .columns(columnsToSelect)
                        .where({
                            'BusinessPartner': businessPartner,
                            'AddressID': addressId
                        })
                )
            } else {
                //if no parameter, we read all Business Partner Addresses
                return await tx.run(
                    SELECT.from(entity)
                        .columns(columnsToSelect)
                )
            }

        } catch (err) {
            req.reject(err);
        }
    });

    //POST http://localhost:4004/address-manager/BusinessPartnerAddresses
    this.on('CREATE', BusinessPartnerAddresses, async (req) => {
        try {
            const address = buildAddressForCreate(req);
            const result = await BusinessPartnerAddress
                .requestBuilder()
                .create(address)
                .execute(sdkDest);
            return prepareResult(result);
        } catch (err) {
            req.reject(err);
        }
    });

    //PUT http://localhost:4004/address-manager/BusinessPartnerAddresses(BusinessPartner='',AddressID='')
    this.on('UPDATE', BusinessPartnerAddresses, async (req) => {
        try {
            const address = buildAddressForUpdate(req);
            const result = await BusinessPartnerAddress
                .requestBuilder()
                .update(address)
                .execute(sdkDest);
            return prepareResult(result);
        } catch (err) {
            req.reject(err);
        }
    });

    //DELETE http://localhost:4004/address-manager/BusinessPartnerAddresses(BusinessPartner='',AddressID='')
    this.on('DELETE', BusinessPartnerAddresses, async (req) => {
        try {
            const { BusinessPartner, AddressID } = req.params[0];
            await BusinessPartnerAddress
                .requestBuilder()
                .delete(BusinessPartner, AddressID)
                .execute(sdkDest);
        } catch (err) {
            req.reject(err);
        }
    });

});