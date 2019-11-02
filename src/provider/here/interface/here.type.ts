export type HereResponseType = H.service.ServiceResult;

export type HereOneResultType = Required<H.service.ServiceResult>['Response']['View'][0]['Result'][0];
export type HereOneResultAddressType = Partial<HereOneResultType['Location']['Address']>;
export type HereOneResultAddressAdditionalDataType = Required<HereOneResultAddressType>['AdditionalData'][0];
